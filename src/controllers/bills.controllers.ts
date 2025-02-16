import _ from "lodash";

import { type API } from "@/api";
import { Pagination } from "@/types";
import { type ClientBill } from "@/schemas";
import { type SupabaseInstance } from "@/services/supabase/server";
import { NotificationsControllers } from "@/controllers/notifications.controllers";

export namespace BillsControllers {
	const BILLS_SELECT = `
    id,
    creator:profiles!creator_id   (userId:id, fullName:full_name),
    createdAt:created_at,
    
    updater:profiles!updater_id   (userId:id, fullName:full_name),
    updatedAt:updated_at,
    
    description,
    issuedAt:issued_at,
    receiptFile:receipt_file,
    totalAmount:total_amount,
    creditor:profiles!creditor_id (userId:id, fullName:full_name),
    billDebtors:bill_debtors (user:user_id (userId:id, fullName:full_name), amount, role)
  `;

	export async function create(
		supabase: SupabaseInstance,
		payload: { issuedAt: string; creatorId: string; creditorId: string; totalAmount: number; description: string }
	) {
		const { description, issuedAt: issued_at, creatorId: creator_id, creditorId: creditor_id, totalAmount: total_amount } = payload;
		const { data } = await supabase.from("bills").insert({ issued_at, creator_id, description, creditor_id, total_amount }).select("id").single();

		if (!data) {
			throw new Error("Error creating bill");
		}

		await NotificationsControllers.createManyBillCreated(supabase, [
			{ billId: data.id, role: "Creditor", userId: creditor_id, amount: total_amount, triggerId: creator_id }
		]);

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

		let billMembersQuery = supabase.from("bill_debtors").select(`billId:bill_id`);

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
		const { creator, updater, creditor, updatedAt, createdAt, totalAmount, billDebtors, ...rest } = bill;

		const debtors = billDebtors.filter((bm) => bm.role === "Debtor");

		return {
			...rest,
			debtors: debtors.map(toMember),
			creator: { ...creator, timestamp: createdAt },
			updater: updater && updatedAt ? { ...updater, timestamp: updatedAt } : undefined,
			creditor: { amount: totalAmount, userId: creditor.userId, role: "Creditor" as const, fullName: creditor.fullName }
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
	type BillMemberSelectResult = BillSelectResult["billDebtors"][number];

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
		payload: {
			issuedAt: string;
			updaterId: string;
			creditorId: string;
			totalAmount: number;
			description: string;
			receiptFile: string | null;
		}
	) {
		const {
			description,
			issuedAt: issued_at,
			updaterId: updater_id,
			creditorId: creditor_id,
			totalAmount: total_amount,
			receiptFile: receipt_file
		} = payload;

		const { data: currentBill } = await supabase.from("bills").select(BILLS_SELECT).eq("id", id).single();

		if (!currentBill) {
			throw new Error("Bill not found");
		}

		await computeCreditorNotifications(supabase, {
			billId: id,
			triggerId: updater_id,
			nextCreditor: { userId: creditor_id, amount: total_amount },
			currentCreditor: { amount: currentBill.totalAmount, userId: currentBill.creditor.userId }
		});

		const { data, error } = await supabase
			.from("bills")
			.update({ issued_at, updater_id, creditor_id, description, total_amount, receipt_file })
			.eq("id", id)
			.select();

		// TODO: Update creditor notifications

		if (error) {
			throw error;
		}

		if (!data) {
			throw new Error("Error updating bill");
		}

		return data;
	}

	interface Creditor {
		readonly userId: string;
		readonly amount: number;
	}
	async function computeCreditorNotifications(
		supabase: SupabaseInstance,
		payload: { billId: string; triggerId: string; nextCreditor: Creditor; currentCreditor: Creditor }
	) {
		const { billId, triggerId, nextCreditor, currentCreditor } = payload;

		if (currentCreditor.userId === nextCreditor.userId) {
			if (currentCreditor.amount === nextCreditor.amount) {
				return;
			}

			await NotificationsControllers.createManyBillUpdated(supabase, [
				{ billId, triggerId, userId: currentCreditor.userId, currentAmount: nextCreditor.amount, previousAmount: currentCreditor.amount }
			]);

			return;
		}

		await NotificationsControllers.createManyBillDeleted(supabase, [{ billId, triggerId, role: "Creditor", userId: currentCreditor.userId }]);
		await NotificationsControllers.createManyBillCreated(supabase, [
			{ billId, triggerId, role: "Creditor", amount: nextCreditor.amount, userId: nextCreditor.userId }
		]);
	}
}
