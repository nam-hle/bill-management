import type { NextRequest } from "next/server";

import { API } from "@/api";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { type BillMemberRole } from "@/schemas";
import { BillsControllers, BillMembersControllers } from "@/controllers";
import { getCurrentUser, createSupabaseServer } from "@/services/supabase/server";

export async function GET(request: NextRequest) {
	try {
		const supabase = await createSupabaseServer();

		const searchParams = API.Bills.List.SearchParamsSchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));

		if (searchParams.error || !searchParams.data) {
			return new Response(JSON.stringify({ error: "Invalid request query", details: searchParams.error.errors }), { status: 400 });
		}

		const { id: currentUserId } = await getCurrentUser();

		const { debtorId, creatorId, creditorId, ...rest } = searchParams.data;

		const resolvedSearchParams: BillsControllers.GetManyByMemberIdPayload = {
			...rest,
			memberId: currentUserId,
			limit: DEFAULT_PAGE_SIZE,
			debtorId: debtorId === "me" ? currentUserId : undefined,
			creatorId: creatorId === "me" ? currentUserId : undefined,
			creditorId: creditorId === "me" ? currentUserId : undefined
		};

		const response: API.Bills.List.Response = await BillsControllers.getManyByMemberId(supabase, resolvedSearchParams);

		return new Response(JSON.stringify(response), { status: 200 });
	} catch (error) {
		return new Response(
			JSON.stringify({
				error: "Internal Server Error",
				details: (error as any).message
			}),
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const supabase = await createSupabaseServer();
		const parsedBody = API.Bills.UpsertBillSchema.safeParse(body);

		if (parsedBody.error) {
			return new Response(JSON.stringify({ error: "Invalid request body", details: parsedBody.error.errors }), {
				status: 400
			});
		}

		const { debtors, issuedAt, creditor, description } = parsedBody.data;
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
		return new Response(
			JSON.stringify({
				error: "Internal Server Error",
				details: (error as any).message
			}),
			{ status: 500 }
		);
	}
}
