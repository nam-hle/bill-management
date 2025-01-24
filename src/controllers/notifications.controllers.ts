import { type SupabaseInstance } from "@/supabase/server";
import { type BillMemberRole, type ClientNotification } from "@/types";

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

	export interface BaseCreatePayload {
		readonly userId: string;
		readonly triggerId: string;
	}

	export interface CreateBillCreatedPayload extends BaseCreatePayload {
		readonly billId: string;
		readonly amount: number;
		readonly role: BillMemberRole;
	}

	export async function createManyBillCreated(supabase: SupabaseInstance, payload: CreateBillCreatedPayload[]) {
		const { error } = await supabase.from("notifications").insert(
			payload.filter(removeSelfNotification).map(({ role, amount, ...rest }) => {
				return {
					...rest,
					type: "BillCreated" as const,
					metadata: { previous: {}, current: { role, amount } }
				};
			})
		);

		if (error) {
			throw error;
		}
	}

	const removeSelfNotification = (payload: BaseCreatePayload) => payload.userId !== payload.triggerId;
}
