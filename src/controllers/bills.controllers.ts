import _ from "lodash";

import { Pagination, type ClientBill } from "@/types";
import { type SupabaseInstance } from "@/supabase/server";

export namespace BillsControllers {
	const BILLS_SELECT = `
    id,
    description,
    createdAt,
    updatedAt,
    issuedAt,
    creator:creatorId (userId:id, fullName),
    bill_members (user:userId (userId:id, fullName), amount, role)
  `;

	export async function createBill(supabase: SupabaseInstance, payload: { issuedAt: string; creatorId: string; description: string }) {
		const { data } = await supabase.from("bills").insert(payload).select("id").single();

		if (!data) {
			throw new Error("Error creating bill");
		}

		return data;
	}

	export async function getBillsByMemberId(
		supabase: SupabaseInstance,
		filters: {
			since?: string;
			memberId: string;
			debtorId?: string;
			creatorId?: string;
			creditorId?: string;
			textSearch?: string;
		},
		pagination: Pagination
	): Promise<{ fullSize: number; bills: ClientBill[] }> {
		const { since, memberId, debtorId, creatorId, creditorId } = filters;

		let billMembersQuery = supabase.from("bill_members").select(`billId`).eq(`userId`, memberId);

		if (creditorId !== undefined) {
			billMembersQuery = billMembersQuery.eq("userId", creditorId).eq("role", "Creditor");
		}

		if (debtorId !== undefined) {
			billMembersQuery = billMembersQuery.eq("userId", debtorId).eq("role", "Debtor");
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

		if (since !== undefined && /^\w+d$/.test(since)) {
			const days = parseInt(since.replace("d", ""), 10);

			if (!isNaN(days)) {
				const date = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
				const timeBills = (await supabase.from("bills").select(`id`).gt("createdAt", date)).data ?? [];

				billIDs = _.intersection(
					billIDs,
					timeBills.map(({ id }) => id)
				);
			}
		}

		let finalQuery = supabase.from("bills").select(BILLS_SELECT, { count: "exact" }).in("id", billIDs);

		if (filters.textSearch) {
			finalQuery = finalQuery.filter("description", "fts", `${filters.textSearch}:*`);
		}

		const { count, data: bills } = await finalQuery.order("createdAt", { ascending: false }).range(...Pagination.toRange(pagination));

		return { fullSize: count ?? 0, bills: bills?.map(toClientBill) ?? [] };
	}

	function toClientBill(bill: BillSelectResult): ClientBill {
		const { bill_members, ...rest } = bill;

		const creditor = bill_members.find((bm) => bm.role === "Creditor");
		const debtors = bill_members.filter((bm) => bm.role === "Debtor");

		if (!creditor) {
			throw new Error("Creator not found");
		}

		return {
			...rest,
			creditor: toMember(creditor),
			debtors: debtors.map(toMember)
		};

		function toMember(billMember: BillMemberSelectResult) {
			const { role, user, amount } = billMember;

			return { role, amount, ...user };
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async function __getBill(supabase: SupabaseInstance) {
		const { data } = await supabase.from("bills").select(BILLS_SELECT).single();

		if (!data) {
			throw new Error("Bill not found");
		}

		return data;
	}

	type BillSelectResult = Awaited<ReturnType<typeof __getBill>>;
	type BillMemberSelectResult = BillSelectResult["bill_members"][number];

	export async function getBillById(supabase: SupabaseInstance, id: string): Promise<ClientBill> {
		const { data } = await supabase.from("bills").select(BILLS_SELECT).eq("id", id).single();

		if (!data) {
			throw `Bill with id ${id} not found`;
		}

		return toClientBill(data);
	}

	export async function updateById(supabase: SupabaseInstance, id: string, payload: { issuedAt: string; description: string }) {
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
