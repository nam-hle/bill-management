import type { ClientBill } from "@/types";
import { type SupabaseInstance } from "@/supabase/server";

export namespace BillsControllers {
	const BILLS_SELECT = `
    id,
    description,
    createdAt,
    updatedAt,
    creator:creatorId (username, fullName),
    bill_members (id, userId, amount, role)
  `;

	export async function createBill(supabase: SupabaseInstance, payload: { description: string; creatorId: string }) {
		const { data } = await supabase.from("bills").insert(payload).select("id").single();

		if (!data) {
			throw new Error("Error creating bill");
		}

		return data;
	}

	export async function getBillsByMemberId(supabase: SupabaseInstance, memberId: string | undefined): Promise<ClientBill[]> {
		if (!memberId) {
			return getBills(supabase);
		}

		const { data: targetBillIds } = await supabase
			.from("bill_members")
			.select("billId")
			.eq("userId", memberId)
			.order("createdAt", { ascending: false });

		if (!targetBillIds?.length) {
			return [];
		}

		const { data } = await supabase.from("bills").select(BILLS_SELECT).eq(`bill_members.userId`, memberId);

		return data ?? [];
	}

	export async function getBills(supabase: SupabaseInstance): Promise<ClientBill[]> {
		const { data = [] } = await supabase.from("bills").select(BILLS_SELECT);

		return data ?? [];
	}

	export async function getBillById(supabase: SupabaseInstance, id: string): Promise<ClientBill> {
		const { data } = await supabase.from("bills").select(BILLS_SELECT).eq("id", id).single();

		if (!data) {
			throw `Bill with id ${id} not found`;
		}

		return data;
	}

	export async function updateById(supabase: SupabaseInstance, id: string, payload: { description: string }) {
		const { data, error } = await supabase.from("bills").update(payload).eq("id", id).select();

		if (error) {
			throw error;
		}

		if (!data) {
			throw new Error("Error updating bill");
		}

		return data;
	}
}
