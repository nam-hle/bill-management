import { type SupabaseInstance } from "@/supabase/server";
import {
	type BillMemberRole,
	type NotificationType,
	type ClientNotification,
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

	const PAGE_SIZE = 4;

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

		if (timestamp.after) {
			return {
				count,
				notifications: notifications.slice(0, PAGE_SIZE) as unknown as ClientNotification[]
			};
		}

		return {
			count,
			hasOlder: notifications.length > PAGE_SIZE,
			notifications: notifications.slice(0, PAGE_SIZE) as unknown as ClientNotification[]
		};
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
		readonly billId: string;
		readonly triggerId: string;
	}

	export interface CreateBillPayload extends BasePayload {
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

	export interface DeletedBillPayload extends BasePayload {
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

	export interface UpdatedBillPayload extends BasePayload {
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

	const removeSelfNotification = (payload: BasePayload) => payload.userId !== payload.triggerId;

	export async function readAll(supabase: SupabaseInstance, userId: string) {
		await supabase.from("notifications").update({ readStatus: true }).eq("userId", userId);
	}

	export async function read(supabase: SupabaseInstance, notificationId: string) {
		await supabase.from("notifications").update({ readStatus: true }).eq("id", notificationId);

		return countUnreadNotifications(supabase, notificationId);
	}
}
