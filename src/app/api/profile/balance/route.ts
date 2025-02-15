import { RouteUtils } from "@/route.utils";
import { UsersControllers } from "@/controllers";
import { getCurrentUser, createSupabaseServer } from "@/services/supabase/server";

export async function GET() {
	try {
		const supabase = await createSupabaseServer();
		const currentUser = await getCurrentUser();

		const report = await UsersControllers.reportUsingView(supabase, currentUser.id);

		return new Response(JSON.stringify(report), { status: 200 });
	} catch (error) {
		return RouteUtils.ServerError;
	}
}
