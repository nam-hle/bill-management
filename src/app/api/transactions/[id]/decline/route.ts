import { createSupabaseServer } from "@/services";
import { TransactionsControllers } from "@/controllers";

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const transactionId = (await params).id;
		const supabase = await createSupabaseServer();

		await TransactionsControllers.update(supabase, { id: transactionId, status: "Declined" });

		return new Response(JSON.stringify({}), { status: 200 });
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
