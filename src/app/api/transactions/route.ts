import { type NextRequest } from "next/server";

import { DEFAULT_PAGE_NUMBER } from "@/constants";
import { getCurrentUser, createSupabaseServer } from "@/supabase/server";
import { TransactionsControllers } from "@/controllers/transactions.controllers";
import { APIPayload, type DataListResponse, type ClientTransaction } from "@/types";

export async function GET(request: NextRequest) {
	try {
		const supabase = await createSupabaseServer();

		const { searchParams } = request.nextUrl;
		const receiverId = searchParams.get("receiverId") ?? undefined;
		const senderId = searchParams.get("senderId") ?? undefined;
		const pageNumber = parseInt(searchParams.get("page") ?? String(DEFAULT_PAGE_NUMBER), 10) ?? DEFAULT_PAGE_NUMBER;

		const { fullSize, transactions } = await TransactionsControllers.getMany(supabase, { senderId, receiverId, pageNumber });

		return new Response(JSON.stringify({ fullSize, data: transactions } satisfies DataListResponse<ClientTransaction>), { status: 200 });
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

		const parsedBody = APIPayload.Transaction.CreateTransactionRequestPayloadSchema.safeParse(body);

		if (parsedBody.error) {
			return new Response(JSON.stringify({ error: "Invalid request body", details: parsedBody.error.errors }), {
				status: 400
			});
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
