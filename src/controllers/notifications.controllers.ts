import { type SupabaseInstance } from "@/supabase/server";
import { type ClientNotification, type ServerNotification } from "@/types";

export namespace NotificationsControllers {
	const NOTIFICATIONS_SELECT = `
	id, 
	type,
	userId,
	createdAt,
	readStatus,
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

		const { data: serverNotification } = await query.order("createdAt", { ascending: false });

		if (!serverNotification) {
			throw new Error("Error fetching user");
		}

		return injectMetadata(supabase, serverNotification);
	}

	async function injectMetadata(supabase: SupabaseInstance, notifications: ServerNotification[]): Promise<ClientNotification[]> {
		// const billCreatedNotification = notifications.filter((notification) => notification.type === "BillCreated");
		// const bills = await Promise.all(
		// 	billCreatedNotification.map((notification) => {
		// 		const billId = (notification.metadata as any)?.billId;
		//
		// 		if (!billId) {
		// 			throw new Error("BillId not found in metadata");
		// 		}
		//
		// 		return BillsControllers.getBillById(supabase, billId);
		// 	})
		// );

		return notifications.map((notification) => {
			const { type } = notification;

			// if (type === "BillCreated") {
			// 	const bill = bills.find((bill) => bill.id === (metadata as any)?.billId);
			//
			// 	if (!bill) {
			// 		throw new Error("Bill not found");
			// 	}
			//
			// 	return { ...notification, bill } satisfies BillCreatedNotification;
			// }

			return notification as ClientNotification;
		});
	}
}
