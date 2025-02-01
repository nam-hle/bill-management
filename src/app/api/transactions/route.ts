import { type NextRequest } from "next/server";

import { API } from "@/api";
import { getCurrentUser, createSupabaseServer } from "@/supabase/server";
import { TransactionsControllers } from "@/controllers/transactions.controllers";

export async function GET(request: NextRequest) {
	try {
		const supabase = await createSupabaseServer();

		const { searchParams } = request.nextUrl;
		const result = API.Transactions.List.SearchParamsSchema.safeParse(Object.fromEntries(searchParams));

		if (result.error) {
			return new Response(JSON.stringify({ details: result.error.errors, error: "Invalid request query" }), { status: 400 });
		}

		const response = await TransactionsControllers.getMany(supabase, result.data);

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

		const parsedBody = API.Transactions.Create.BodySchema.safeParse(body);

		if (parsedBody.error) {
			return new Response(JSON.stringify({ error: "Invalid request body", details: parsedBody.error.errors }), { status: 400 });
		}

		const { amount, issuedAt, receiverId } = parsedBody.data;
		const sender = await getCurrentUser();

		await TransactionsControllers.create(supabase, {
			amount,
			issuedAt,
			receiverId,
			senderId: sender.id
		});

		return new Response(JSON.stringify({}), { status: 201 });
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
