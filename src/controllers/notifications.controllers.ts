import { type SupabaseInstance } from "@/supabase/server";
import {
	type BillMemberRole,
	type NotificationType,
	type ClientNotification,
	type TransactionCreatedNotification,
	type BillUpdatedNotificationMetadata,
	type BillDeletedNotificationMetadata,
	type BillCreatedNotificationMetadata
} from "@/types";

export namespace NotificationsControllers {
	const NOTIFICATIONS_SELECT = `
	id, 
	type,
	userId,
	createdAt,
	readStatus,
	metadata,
	trigger:profiles!triggerId (username, fullName),
	
	transaction:transaction_id (
		id,
		amount,
		sender:profiles!sender_id (userId:id, username, fullName),
    receiver:profiles!receiver_id (userId:id, username, fullName)
	),

	bill:billId (
		id, 
		description, 
		createdAt, 
		creator:profiles!creatorId (
			username,
			fullName
		)
	)
	`;

	export interface QueryPayload {
		readonly userId: string;
		readonly timestamp: { after?: string; before?: string };
	}

	const PAGE_SIZE = 5;

	export async function getByUserId(
		supabase: SupabaseInstance,
		payload: QueryPayload
	): Promise<{ count: number; hasOlder?: boolean; notifications: ClientNotification[] }> {
		const { userId, timestamp } = payload;
		let query = supabase.from("notifications").select(NOTIFICATIONS_SELECT).eq("userId", userId).order("createdAt", { ascending: false });

		if (timestamp.before) {
			query = query.lt("createdAt", timestamp.before).limit(PAGE_SIZE + 1);
		} else if (timestamp.after) {
			query = query.gt("createdAt", timestamp.after);
		} else {
			query = query.limit(PAGE_SIZE + 1);
		}

		const { data: notifications, error: notificationsError } = await query;

		if (notificationsError || notifications === null) {
			throw notificationsError;
		}

		const count = await countUnreadNotifications(supabase, userId);

		return {
			count,
			hasOlder: timestamp.after ? undefined : notifications.length > PAGE_SIZE,
			notifications: notifications.slice(0, PAGE_SIZE).map(toClientNotification)
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
		if (selectResult.type === "BillCreated" || selectResult.type === "BillDeleted" || selectResult.type === "BillUpdated") {
			if (selectResult.bill === null) {
				throw new Error("Bill not found");
			}

			return selectResult as unknown as ClientNotification;
		}

		if (selectResult.type === "TransactionCreated") {
			console.log(selectResult);

			return {
				...selectResult
			} as unknown as TransactionCreatedNotification;
		}

		throw new Error("Invalid notification type");
	}

	export async function countUnreadNotifications(supabase: SupabaseInstance, userId: string): Promise<number> {
		const { data, error } = await supabase.from("notifications").select("*", { count: "exact" }).eq("userId", userId).eq("readStatus", false);

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
			payload.filter(removeSelfNotification).map(({ role, amount, ...rest }) => {
				return {
					...rest,
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
			payloads.filter(removeSelfNotification).map(({ role, ...rest }) => {
				return {
					...rest,
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
			payloads.filter(removeSelfNotification).map(({ currentAmount, previousAmount, ...rest }) => {
				return {
					...rest,
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
	}
	export async function createTransactionCreated(supabase: SupabaseInstance, payload: TransactionPayload) {
		const { userId, triggerId, transactionId } = payload;
		const { error } = await supabase.from("notifications").insert([{ userId, triggerId, type: "TransactionCreated", metadata: { transactionId } }]);

		if (error) {
			throw error;
		}
	}

	const removeSelfNotification = (payload: BaseBillPayload) => payload.userId !== payload.triggerId;

	export async function readAll(supabase: SupabaseInstance, userId: string) {
		await supabase.from("notifications").update({ readStatus: true }).eq("userId", userId);
	}

	export async function read(supabase: SupabaseInstance, notificationId: string) {
		await supabase.from("notifications").update({ readStatus: true }).eq("id", notificationId);

		return countUnreadNotifications(supabase, notificationId);
	}
}
