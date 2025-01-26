import { createSupabaseServer } from "@/supabase/server";
import { TransactionsControllers } from "@/controllers/transactions.controllers";

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const transactionId = (await params).id;
		const supabase = await createSupabaseServer();

		await TransactionsControllers.update(supabase, { id: transactionId, status: "Confirmed" });

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
