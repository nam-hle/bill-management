import { type BillMemberRole } from "@/types";
import { type SupabaseInstance } from "@/supabase/server";
import { NotificationsControllers } from "@/controllers/notifications.controllers";

export namespace BillMembersControllers {
	export async function updateMany(supabase: SupabaseInstance, payload: { billId: string; userId: string; amount: number; role: BillMemberRole }[]) {
		const updatePromises = payload.map((update) =>
			supabase.from("bill_members").update({ amount: update.amount }).match({ role: update.role, billId: update.billId, userId: update.userId })
		);

		const results = await Promise.all(updatePromises);

		const errors = results.filter((result) => result.error);

		if (errors.length > 0) {
			throw new Error("Error updating bill members");
		}
	}

	export interface CreatePayload {
		readonly billId: string;
		readonly userId: string;
		readonly amount: number;
		readonly role: BillMemberRole;
	}
	export async function createMany(supabase: SupabaseInstance, triggerId: string, payloads: CreatePayload[]) {
		await supabase.from("bill_members").insert(payloads);

		await NotificationsControllers.createManyBillCreated(
			supabase,
			payloads.map((payload) => ({ ...payload, triggerId }))
		);
	}

	export interface DeletedPayload {
		readonly billId: string;
		readonly userId: string;
		readonly role: BillMemberRole;
	}

	export async function deleteMany(supabase: SupabaseInstance, triggerId: string, payloads: DeletedPayload[]) {
		const deletePromises = payloads.map((payload) => supabase.from("bill_members").delete().match(payload));

		const results = await Promise.all(deletePromises);

		const errors = results.filter((result) => result.error);

		if (errors.length > 0) {
			throw new Error("Error deleting bill members");
		}

		await NotificationsControllers.createManyBillDeleted(
			supabase,
			payloads.map((payload) => ({ ...payload, triggerId }))
		);
	}

	const SELECT = `userId, role, amount, profiles (username)`;

	export async function getAll(supabase: SupabaseInstance) {
		const { data } = await supabase.from("bill_members").select(SELECT);

		if (!data) {
			throw new Error("Error getting bill members");
		}

		return data;
	}
}
