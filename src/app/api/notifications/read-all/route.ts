import { RouteUtils } from "@/route.utils";
import { NotificationsControllers } from "@/controllers";
import { getCurrentUser, createSupabaseServer } from "@/services/supabase/server";

export async function PATCH() {
	try {
		const supabase = await createSupabaseServer();
		const currentUser = await getCurrentUser();

		await NotificationsControllers.readAll(supabase, currentUser.id);

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		return RouteUtils.ServerError;
	}
}
