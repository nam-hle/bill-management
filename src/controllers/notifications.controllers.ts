import { type ClientNotification } from "@/types";
import { type SupabaseInstance } from "@/supabase/server";

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
}
