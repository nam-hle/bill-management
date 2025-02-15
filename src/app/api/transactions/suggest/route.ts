import { RouteUtils } from "@/route.utils";
import { TransactionsControllers } from "@/controllers";
import { getCurrentUser, createSupabaseServer } from "@/services/supabase/server";

export async function POST() {
	try {
		const supabase = await createSupabaseServer();
		const currentUser = await getCurrentUser();

		const response = await TransactionsControllers.suggest(supabase, currentUser.id);

		return new Response(JSON.stringify(response), { status: 200 });
	} catch (error) {
		return RouteUtils.ServerError;
	}
}
