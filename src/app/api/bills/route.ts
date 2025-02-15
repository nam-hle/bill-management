import type { NextRequest } from "next/server";

import { API } from "@/api";
import { RouteUtils } from "@/route.utils";
import { type BillMemberRole } from "@/schemas";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from "@/constants";
import { BillsControllers, BillMembersControllers } from "@/controllers";
import { getCurrentUser, createSupabaseServer } from "@/services/supabase/server";

export async function GET(request: NextRequest) {
	try {
		const supabase = await createSupabaseServer();

		const searchParams = await RouteUtils.parseRequestSearchParams(request, API.Bills.List.SearchParamsSchema);

		if (!searchParams) {
			return RouteUtils.BadRequest;
		}

		const { id: currentUserId } = await getCurrentUser();

		const { debtorId, creatorId, creditorId, ...rest } = searchParams;

		const resolvedSearchParams: BillsControllers.GetManyByMemberIdPayload = {
			...rest,
			memberId: currentUserId,
			limit: DEFAULT_PAGE_SIZE,
			page: rest.page ?? DEFAULT_PAGE_NUMBER,
			debtorId: debtorId === "me" ? currentUserId : undefined,
			creatorId: creatorId === "me" ? currentUserId : undefined,
			creditorId: creditorId === "me" ? currentUserId : undefined
		};

		const response: API.Bills.List.Response = await BillsControllers.getManyByMemberId(supabase, resolvedSearchParams);

		return new Response(JSON.stringify(response), { status: 200 });
	} catch (error) {
		return RouteUtils.ServerError;
	}
}

export async function POST(request: Request) {
	try {
		const supabase = await createSupabaseServer();
		const body = await RouteUtils.parseRequestBody(request, API.Bills.UpsertBillSchema);

		if (!body) {
			return RouteUtils.BadRequest;
		}

		const { debtors, issuedAt, creditor, description } = body;
		const creator = await getCurrentUser();

		// Step 1: Insert bill
		const bill = await BillsControllers.create(supabase, {
			issuedAt,
			description,
			creatorId: creator.id
		});

		// Step 2: Insert bill members
		const billMembers = debtors.map(({ userId, amount }) => {
			return {
				userId,
				amount,
				billId: bill.id,
				role: "Debtor" as BillMemberRole
			};
		});

		billMembers.push({
			billId: bill.id,
			userId: creditor.userId,
			amount: creditor.amount,
			role: "Creditor" as BillMemberRole
		});

		await BillMembersControllers.createMany(supabase, creator.id, billMembers);

		return new Response(JSON.stringify({ success: true, data: { bill } }), {
			status: 201
		});
	} catch (error) {
		return RouteUtils.ServerError;
	}
}
