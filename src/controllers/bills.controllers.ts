import _ from "lodash";

import type { ClientBill } from "@/types";
import { type SupabaseInstance } from "@/supabase/server";

export namespace BillsControllers {
	const BILLS_SELECT = `
    id,
    description,
    createdAt,
    updatedAt,
    creator:creatorId (username, fullName),
    bill_members (id, user:userId (id, username, fullName), amount, role)
  `;

	export async function createBill(supabase: SupabaseInstance, payload: { description: string; creatorId: string }) {
		const { data } = await supabase.from("bills").insert(payload).select("id").single();

		if (!data) {
			throw new Error("Error creating bill");
		}

		return data;
	}

	export async function getBillsByMemberId(
		supabase: SupabaseInstance,
		filters: { creditorId: string | undefined; memberId: string; debtorId: string | undefined; creatorId: string | undefined }
	): Promise<ClientBill[]> {
		const { memberId, creditorId, debtorId, creatorId } = filters;

		let billMembersQuery = supabase.from("bill_members").select(`billId`);

		if (Object.values(filters).filter(Boolean).length === 1) {
			billMembersQuery = billMembersQuery.eq(`userId`, memberId);
		} else {
			if (creditorId !== undefined) {
				billMembersQuery = billMembersQuery.eq("userId", creditorId).eq("role", "Creditor");
			}

			if (debtorId !== undefined) {
				billMembersQuery = billMembersQuery.eq("userId", debtorId).eq("role", "Debtor");
			}
		}

		const billMembers = (await billMembersQuery).data ?? [];
		let billIDs = _.uniqBy(billMembers, "billId").map(({ billId }) => billId);

		if (creatorId !== undefined) {
			const createdBills = (await supabase.from("bills").select(`id`).eq("creatorId", creatorId)).data ?? [];

			billIDs = _.intersection(
				billIDs,
				createdBills.map(({ id }) => id)
			);
		}

		const { data: bills } = await supabase.from("bills").select(BILLS_SELECT).in("id", billIDs).order("createdAt", { ascending: false });

		return bills ?? [];
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
