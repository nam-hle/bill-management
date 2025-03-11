import { TRPCError } from "@trpc/server";

import { type API } from "@/api";
import { ensureAuthorized } from "@/controllers/utils";
import { GroupController } from "@/controllers/group.controller";
import { type ClientBill, type ClientBillMember } from "@/schemas";
import { NotificationsControllers } from "@/controllers/notifications.controllers";
import { type MemberContext, type SupabaseInstance } from "@/services/supabase/server";

export namespace BillsControllers {
	const BILLS_SELECT = `
    id,
    creator:profiles!creator_id   (userId:id, fullName:full_name),
    createdAt:created_at,
    group:groups!group_id (${GroupController.GROUP_SELECT}),
    
    updater:profiles!updater_id   (userId:id, fullName:full_name),
    updatedAt:updated_at,
    
    description,
    issuedAt:issued_at,
    receiptFile:receipt_file,
    totalAmount:total_amount,
    creditor:profiles!creditor_id (userId:id, fullName:full_name, avatarUrl:avatar_url),
    billDebtors:bill_debtors (user:user_id (userId:id, fullName:full_name, avatarUrl:avatar_url), amount, role)
  `;

	export async function create(
		supabase: SupabaseInstance,
		payload: {
			groupId: string;
			issuedAt: string;
			creatorId: string;
			creditorId: string;
			totalAmount: number;
			description: string;
			receiptFile: string | null;
		}
	) {
		const {
			description,
			groupId: group_id,
			issuedAt: issued_at,
			creatorId: creator_id,
			creditorId: creditor_id,
			receiptFile: receipt_file,
			totalAmount: total_amount
		} = payload;
		const { data } = await supabase
			.from("bills")
			.insert({ group_id, issued_at, creator_id, description, creditor_id, receipt_file, total_amount })
			.select("id")
			.single();

		if (!data) {
			throw new Error("Error creating bill");
		}

		await NotificationsControllers.createManyBillCreated(supabase, [
			{ billId: data.id, role: "Creditor", userId: creditor_id, amount: total_amount, triggerId: creator_id }
		]);

		return data;
	}

	export interface GetManyByMemberIdPayload extends Omit<API.Bills.List.Payload, "debtor" | "creator" | "creditor"> {
		readonly limit: number;
		readonly member: string;
		readonly debtor?: string;
		readonly creator?: string;
		readonly creditor?: string;
	}

	export async function getManyByMemberId(
		supabase: SupabaseInstance,
		memberContext: MemberContext,
		payload: GetManyByMemberIdPayload
	): Promise<API.Bills.List.Response> {
		const { page, limit, since, debtor, member, creator, creditor, q: textSearch } = payload;

		let sinceDate: string | null = null;

		if (since !== undefined && /^\d+d$/.test(since)) {
			const days = parseInt(since.replace("d", ""), 10);

			if (!isNaN(days)) {
				sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
			}
		}

		const { data, error } = await supabase.rpc("get_filtered_bills", {
			page_size: limit,
			page_number: page,
			text_search: textSearch ?? undefined,
			since_timestamp: sinceDate ?? undefined,

			member,
			debtor,
			creator,
			creditor,
			group: memberContext.group.id
		});

		if (error) {
			throw error;
		}

		if (!data?.length) {
			return { data: [], fullSize: 0 };
		}

		const { data: bills } = await supabase
			.from("bills")
			.select(BILLS_SELECT)
			.in("id", data?.map((e) => e.id) ?? [])
			.order("created_at", { ascending: false });

		return { fullSize: data[0].total_count, data: bills?.map(toClientBill) ?? [] };
	}

	function toClientBill(bill: BillSelectResult): ClientBill {
		const { creator, updater, creditor, updatedAt, createdAt, totalAmount, billDebtors, ...rest } = bill;

		const debtors = billDebtors.filter((bm) => bm.role === "Debtor");

		return {
			...rest,
			debtors: debtors.map(toMember),
			creator: { ...creator, timestamp: createdAt },
			updater: updater && updatedAt ? { ...updater, timestamp: updatedAt } : undefined,
			creditor: { amount: totalAmount, userId: creditor.userId, role: "Creditor" as const, avatar: creditor.avatarUrl, fullName: creditor.fullName }
		};

		function toMember(billMember: BillMemberSelectResult): ClientBillMember {
			const { role, user, amount } = billMember;

			return { role, amount, ...{ ...user, avatar: user.avatarUrl } };
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

	export async function getById(supabase: SupabaseInstance, payload: { userId: string; billId: string }): Promise<ClientBill> {
		const { data: bill } = await supabase.from("bills").select(BILLS_SELECT).eq("id", payload.billId).single();

		if (!bill) {
			throw new TRPCError({ code: "NOT_FOUND", message: "Bill not found" });
		}

		// TODO: Remove this after implementing RLS
		await ensureAuthorized(supabase, { userId: payload.userId, groupId: bill.group.id });

		return toClientBill(bill);
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
