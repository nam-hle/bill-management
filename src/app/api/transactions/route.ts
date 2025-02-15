import { type NextRequest } from "next/server";

import { API } from "@/api";
import { RouteUtils } from "@/route.utils";
import { TransactionsControllers } from "@/controllers";
import { getCurrentUser, createSupabaseServer } from "@/services/supabase/server";

export async function GET(request: NextRequest) {
	try {
		const supabase = await createSupabaseServer();

		const searchParams = await RouteUtils.parseRequestSearchParams(request, API.Bills.List.SearchParamsSchema);

		if (!searchParams) {
			return RouteUtils.BadRequest;
		}

		const response = await TransactionsControllers.getMany(supabase, searchParams);

		return new Response(JSON.stringify(response), { status: 200 });
	} catch (error) {
		return RouteUtils.ServerError;
	}
}

export async function POST(request: Request) {
	try {
		const supabase = await createSupabaseServer();

		const body = await request.json();
		const parsedBody = API.Transactions.Create.BodySchema.safeParse(body);

		if (parsedBody.error) {
			return new Response(JSON.stringify({ error: "Invalid request body", details: parsedBody.error.errors }), { status: 400 });
		}

		const { amount, issuedAt, receiverId, bankAccountId } = parsedBody.data;
		const sender = await getCurrentUser();

		await TransactionsControllers.create(supabase, {
			amount,
			issuedAt,
			receiverId,
			bankAccountId,
			senderId: sender.id
		});

		return new Response(JSON.stringify({}), { status: 201 });
	} catch (error) {
		return RouteUtils.ServerError;
	}
}
