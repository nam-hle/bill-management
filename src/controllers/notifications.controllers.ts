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
	trigger:triggerId (username, fullName),

	bill:billId (
		id, 
		description, 
		createdAt, 
		creator:creatorId (
			username,
			fullName
		)
	)
	`;

	export async function getByUserId(supabase: SupabaseInstance, userId: string, from?: string): Promise<ClientNotification[]> {
		let query = supabase.from("notifications").select(NOTIFICATIONS_SELECT).eq("userId", userId);

		if (from !== undefined) {
			query = query.gt("createdAt", from);
		}

		const { error, data: serverNotification } = await query.order("createdAt", { ascending: false });

		if (error) {
			throw error;
		}

		if (!serverNotification) {
			return [];
		}

		return serverNotification as unknown as ClientNotification[];
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
}
