import _ from "lodash";

import { type API } from "@/api";
import { Pagination } from "@/types";
import { type ClientBill } from "@/schemas";
import { type SupabaseInstance } from "@/services";

export namespace BillsControllers {
	const BILLS_SELECT = `
    id,
    description,
    createdAt:created_at,
    updatedAt:updated_at,
    issuedAt:issued_at,
    receiptFile:receipt_file,
    creator:profiles!creator_id (userId:id, fullName:full_name),
    updater:profiles!updater_id (userId:id, fullName:full_name),
    billMembers:bill_members (user:user_id (userId:id, fullName:full_name), amount, role)
  `;

	export async function create(supabase: SupabaseInstance, payload: { issuedAt: string; creatorId: string; description: string }) {
		const { description, issuedAt: issued_at, creatorId: creator_id } = payload;
		const { data } = await supabase.from("bills").insert({ issued_at, creator_id, description }).select("id").single();

		if (!data) {
			throw new Error("Error creating bill");
		}

		return data;
	}

	export interface GetManyByMemberIdPayload extends Omit<API.Bills.List.SearchParams, "debtorId" | "creatorId" | "creditorId"> {
		readonly limit: number;
		readonly memberId: string;
		readonly debtorId?: string;
		readonly creatorId?: string;
		readonly creditorId?: string;
	}

	export async function getManyByMemberId(supabase: SupabaseInstance, payload: GetManyByMemberIdPayload): Promise<API.Bills.List.Response> {
		const { page, since, limit, memberId, debtorId, creatorId, creditorId, textSearch } = payload;

		let billMembersQuery = supabase.from("bill_members").select(`billId:bill_id`);

		if (creditorId !== undefined) {
			billMembersQuery = billMembersQuery.eq("user_id", creditorId).eq("role", "Creditor");
		}

		if (debtorId !== undefined) {
			billMembersQuery = billMembersQuery.eq("user_id", debtorId).eq("role", "Debtor");
		}

		if (creditorId === undefined && debtorId === undefined && creatorId === undefined) {
			billMembersQuery = billMembersQuery.eq("user_id", memberId);
		}

		const billMembers = (await billMembersQuery).data ?? [];
		let billIDs = _.uniqBy(billMembers, "billId").map(({ billId }) => billId);

		if (creatorId !== undefined) {
			const createdBills = (await supabase.from("bills").select(`id`).eq("creator_id", creatorId)).data ?? [];
			billIDs = _.intersection(
				billIDs,
				createdBills.map(({ id }) => id)
			);
		}

		if (since !== undefined && /^\w+d$/.test(since)) {
			const days = parseInt(since.replace("d", ""), 10);

			if (!isNaN(days)) {
				const date = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
				const timeBills = (await supabase.from("bills").select(`id`).gt("created_at", date)).data ?? [];

				billIDs = _.intersection(
					billIDs,
					timeBills.map(({ id }) => id)
				);
			}
		}

		let finalQuery = supabase.from("bills").select(BILLS_SELECT, { count: "exact" }).in("id", billIDs);

		if (textSearch) {
			finalQuery = finalQuery.filter("description", "fts", `${textSearch}:*`);
		}

		const { count, data: bills } = await finalQuery
			.order("created_at", { ascending: false })
			.range(...Pagination.toRange({ pageSize: limit, pageNumber: page }));

		return { fullSize: count ?? 0, data: bills?.map(toClientBill) ?? [] };
	}

	function toClientBill(bill: BillSelectResult): ClientBill {
		const { creator, updater, updatedAt, createdAt, billMembers, ...rest } = bill;

		const creditor = billMembers.find((bm) => bm.role === "Creditor");
		const debtors = billMembers.filter((bm) => bm.role === "Debtor");

		if (!creditor) {
			throw new Error("Creator not found");
		}

		return {
			...rest,
			creditor: toMember(creditor),
			debtors: debtors.map(toMember),
			creator: { ...creator, timestamp: createdAt },
			updater: updater && updatedAt ? { ...updater, timestamp: updatedAt } : undefined
		};

		function toMember(billMember: BillMemberSelectResult) {
			const { role, user, amount } = billMember;

			return { role, amount, ...user };
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async function __get(supabase: SupabaseInstance) {
		const { data } = await supabase.from("bills").select(BILLS_SELECT).single();

		if (!data) {
			throw new Error("Bill not found");
		}

		return data;
	}

	type BillSelectResult = Awaited<ReturnType<typeof __get>>;
	type BillMemberSelectResult = BillSelectResult["billMembers"][number];

	export async function getById(supabase: SupabaseInstance, id: string): Promise<ClientBill> {
		const { data } = await supabase.from("bills").select(BILLS_SELECT).eq("id", id).single();

		if (!data) {
			throw `Bill with id ${id} not found`;
		}

		return toClientBill(data);
	}

	export async function updateById(
		supabase: SupabaseInstance,
		id: string,
		payload: { issuedAt: string; updaterId: string; description: string; receiptFile: string | null }
	) {
		const { description, issuedAt: issued_at, updaterId: updater_id, receiptFile: receipt_file } = payload;
		const { data, error } = await supabase.from("bills").update({ issued_at, updater_id, description, receipt_file }).eq("id", id).select();

		if (error) {
			throw error;
		}

		if (!data) {
			throw new Error("Error updating bill");
		}

		return data;
	}
}
