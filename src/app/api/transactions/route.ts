import { APIPayload } from "@/types";
import { createSupabaseServer } from "@/supabase/server";
import { TransactionsControllers } from "@/controllers/transactions.controllers";

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

		const {
			data: { user: sender }
		} = await supabase.auth.getUser();

		if (!sender) {
			throw new Error("User not found");
		}

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
