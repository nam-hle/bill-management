import { type API } from "@/api";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { type SupabaseInstance } from "@/services/supabase/server";
import {
	type BillMemberRole,
	type NotificationType,
	type TransactionStatus,
	type ClientNotification,
	type TransactionWaitingNotification,
	type BillCreatedNotificationMetadata,
	type BillDeletedNotificationMetadata,
	type BillUpdatedNotificationMetadata
} from "@/schemas";

export namespace NotificationsControllers {
	const NOTIFICATIONS_SELECT = `
	id, 
	type,
	userId:user_id,
	createdAt:created_at,
	readStatus:read_status,
	metadata,
	trigger:profiles!trigger_id (fullName:full_name),
	
	transaction:transaction_id (
		id,
		amount,
		status,
		createdAt:created_at,
		issuedAt:issued_at,
		sender:profiles!sender_id (id, username, fullName:full_name),
    receiver:profiles!receiver_id (id, username, fullName:full_name)
	),

	bill:bill_id (
		id, 
		description, 
		creator:profiles!creator_id ( fullName:full_name )
	)
	`;

	export async function getByUserId(
		supabase: SupabaseInstance,
		userId: string,
		payload: API.Notifications.List.Payload
	): Promise<API.Notifications.List.Response> {
		let query = supabase.from("notifications").select(NOTIFICATIONS_SELECT).eq("user_id", userId).order("created_at", { ascending: false });
		const before = "page" in payload ? undefined : payload.before;
		const after = "page" in payload ? undefined : payload.after;
		const page = "page" in payload ? payload.page : undefined;

		if (before) {
			query = query.lt("created_at", before).limit(DEFAULT_PAGE_SIZE + 1);
		} else if (after) {
			query = query.gt("created_at", after);
		} else if (page !== undefined) {
			query = query.range((page - 1) * DEFAULT_PAGE_SIZE, (page - 1) * DEFAULT_PAGE_SIZE + DEFAULT_PAGE_SIZE);
		} else {
			query = query.limit(DEFAULT_PAGE_SIZE + 1);
		}

		const { data: notifications, error: notificationsError } = await query;

		if (notificationsError || notifications === null) {
			throw notificationsError;
		}

		const unreadCount = await count(supabase, userId, { readStatus: false });
		const fullSizeCount = await count(supabase, userId, { readStatus: undefined });

		return {
			fullSize: fullSizeCount,
			unreadCount: unreadCount,
			hasOlder: after ? undefined : notifications.length > DEFAULT_PAGE_SIZE,
			notifications: notifications.slice(0, DEFAULT_PAGE_SIZE).map(toClientNotification)
		};
	}

	type NotificationSelectResult = Awaited<ReturnType<typeof __get>>;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async function __get(supabase: SupabaseInstance) {
		const { data } = await supabase.from("notifications").select(NOTIFICATIONS_SELECT).single();

		if (!data) {
			throw new Error("Bill not found");
		}

		return data;
	}

	function toClientNotification(selectResult: NotificationSelectResult): ClientNotification {
		switch (selectResult.type) {
			case "BillCreated":
			case "BillDeleted":
			case "BillUpdated":
				if (selectResult.bill === null) {
					throw new Error("Bill not found");
				}

				return selectResult as unknown as ClientNotification;

			case "TransactionWaiting":
			case "TransactionConfirmed":
			case "TransactionDeclined":
				if (selectResult.transaction === null) {
					throw new Error("Transaction not found");
				}

				return {
					...selectResult
				} as unknown as TransactionWaitingNotification;
			default:
				throw new Error(`Invalid notification type. Got: ${selectResult.type}`);
		}
	}

	export async function count(supabase: SupabaseInstance, userId: string, payload: { readStatus: boolean | undefined }): Promise<number> {
		const query = supabase.from("notifications").select("*", { count: "exact" }).eq("user_id", userId);

		if (payload.readStatus !== undefined) {
			query.eq("read_status", payload.readStatus);
		}

		const { data, error } = await query;

		if (error || data === null) {
			throw error;
		}

		return data.length;
	}

	export interface BasePayload {
		readonly userId: string;
		readonly triggerId: string;
	}

	export interface BaseBillPayload extends BasePayload {
		readonly billId: string;
	}

	export interface CreateBillPayload extends BaseBillPayload {
		readonly amount: number;
		readonly role: BillMemberRole;
	}

	export async function createManyBillCreated(supabase: SupabaseInstance, payload: CreateBillPayload[]) {
		const { error } = await supabase.from("notifications").insert(
			payload.filter(removeSelfNotification).map(({ role, amount, billId: bill_id, userId: user_id, triggerId: trigger_id }) => {
				return {
					user_id,
					bill_id,
					trigger_id,
					type: "BillCreated" as const satisfies NotificationType,
					metadata: { previous: {}, current: { role, amount } } satisfies BillCreatedNotificationMetadata
				};
			})
		);

		if (error) {
			throw error;
		}
	}

	export interface DeletedBillPayload extends BaseBillPayload {
		readonly role: BillMemberRole;
	}

	export async function createManyBillDeleted(supabase: SupabaseInstance, payloads: DeletedBillPayload[]) {
		const { error } = await supabase.from("notifications").insert(
			payloads.filter(removeSelfNotification).map(({ role, billId: bill_id, userId: user_id, triggerId: trigger_id }) => {
				return {
					user_id,
					bill_id,
					trigger_id,
					type: "BillDeleted" as const satisfies NotificationType,
					metadata: { current: {}, previous: { role } } satisfies BillDeletedNotificationMetadata
				};
			})
		);

		if (error) {
			throw error;
		}
	}

	export interface UpdatedBillPayload extends BaseBillPayload {
		readonly currentAmount: number;
		readonly previousAmount: number;
	}

	export async function createManyBillUpdated(supabase: SupabaseInstance, payloads: UpdatedBillPayload[]) {
		const { error } = await supabase.from("notifications").insert(
			payloads.filter(removeSelfNotification).map(({ currentAmount, previousAmount, billId: bill_id, userId: user_id, triggerId: trigger_id }) => {
				return {
					user_id,
					bill_id,
					trigger_id,
					type: "BillUpdated" as const satisfies NotificationType,
					metadata: { current: { amount: currentAmount }, previous: { amount: previousAmount } } satisfies BillUpdatedNotificationMetadata
				};
			})
		);

		if (error) {
			throw error;
		}
	}

	export interface TransactionPayload extends BasePayload {
		readonly transactionId: string;
		readonly status: TransactionStatus;
	}
	export async function createTransaction(supabase: SupabaseInstance, payload: TransactionPayload) {
		const { status, userId: user_id, triggerId: trigger_id, transactionId: transaction_id } = payload;
		const { error } = await supabase.from("notifications").insert([{ user_id, trigger_id, transaction_id, type: `Transaction${status}` }]);

		if (error) {
			throw error;
		}
	}

	const removeSelfNotification = (payload: BaseBillPayload) => payload.userId !== payload.triggerId;

	export async function readAll(supabase: SupabaseInstance, userId: string) {
		await supabase.from("notifications").update({ read_status: true }).eq("user_id", userId);
	}

	export async function read(supabase: SupabaseInstance, userId: string, notificationId: string) {
		await supabase.from("notifications").update({ read_status: true }).eq("id", notificationId);

		return count(supabase, userId, { readStatus: false });
	}
}
