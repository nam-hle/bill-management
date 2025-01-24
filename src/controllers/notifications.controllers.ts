import { type SupabaseInstance } from "@/supabase/server";
import { type BillMemberRole, type ClientNotification, type BillCreatedNotificationMetadata } from "@/types";

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
		readonly triggerId: string;
	}

	export interface CreateBillPayload extends BasePayload {
		readonly billId: string;
		readonly amount: number;
		readonly role: BillMemberRole;
	}

	export async function createManyBillCreated(supabase: SupabaseInstance, payload: CreateBillPayload[]) {
		const { error } = await supabase.from("notifications").insert(
			payload.filter(removeSelfNotification).map(({ role, amount, ...rest }) => {
				return {
					...rest,
					type: "BillCreated" as const,
					metadata: { previous: {}, current: { role, amount } } satisfies BillCreatedNotificationMetadata
				};
			})
		);

		if (error) {
			throw error;
		}
	}

	const removeSelfNotification = (payload: BasePayload) => payload.userId !== payload.triggerId;
}
