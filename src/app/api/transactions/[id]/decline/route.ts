import { RouteUtils } from "@/route.utils";
import { TransactionsControllers } from "@/controllers";
import { createSupabaseServer } from "@/services/supabase/server";

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const transactionId = (await params).id;
		const supabase = await createSupabaseServer();

		await TransactionsControllers.update(supabase, { id: transactionId, status: "Declined" });

		return new Response(JSON.stringify({}), { status: 200 });
	} catch (error) {
		return RouteUtils.ServerError;
	}
}
