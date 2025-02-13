import { type NextRequest } from "next/server";

import { API } from "@/api";
import { TransactionsControllers } from "@/controllers";
import { getCurrentUser, createSupabaseServer } from "@/services/supabase/server";

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
		return new Response(
			JSON.stringify({
				error: "Internal Server Error",
				details: (error as any).message
			}),
			{ status: 500 }
		);
	}
}
