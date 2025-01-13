import { type BillMemberRole } from "@/types";
import { type SupabaseInstance } from "@/supabase/server";

export namespace BillMembersControllers {
	export async function updateMany(supabase: SupabaseInstance, payload: { billId: string; userId: string; amount: number; role: BillMemberRole }[]) {
		const updatePromises = payload.map((update) =>
			supabase.from("bill_members").update({ amount: update.amount }).match({ billId: update.billId, userId: update.userId, role: update.role })
		);

		const results = await Promise.all(updatePromises);

		const errors = results.filter((result) => result.error);

		if (errors.length > 0) {
			throw new Error("Error updating bill members");
		}
	}

	export async function createMany(supabase: SupabaseInstance, payload: { billId: string; userId: string; amount: number; role: BillMemberRole }[]) {
		const { error } = await supabase.from("bill_members").insert(payload);

		if (error) {
			throw error;
		}
	}

	export async function deleteMany(supabase: SupabaseInstance, payload: { billId: string; userId: string; role: BillMemberRole }[]) {
		const deletePromises = payload.map((deleteData) =>
			supabase.from("bill_members").delete().match({ billId: deleteData.billId, userId: deleteData.userId, role: deleteData.role })
		);

		const results = await Promise.all(deletePromises);

		const errors = results.filter((result) => result.error);

		if (errors.length > 0) {
			throw new Error("Error deleting bill members");
		}
	}

	const SELECT = `userId, role, amount, users (username)`;

	export async function getAll(supabase: SupabaseInstance) {
		const { data } = await supabase.from("bill_members").select(SELECT);

		if (!data) {
			throw new Error("Error getting bill members");
		}

		return data;
	}
}
