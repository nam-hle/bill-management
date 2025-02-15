import { type API } from "@/api";
import { RouteUtils } from "@/route.utils";
import { UsersControllers } from "@/controllers";
import { createSupabaseServer } from "@/services/supabase/server";

export async function GET() {
	try {
		const supabase = await createSupabaseServer();

		const users = await UsersControllers.getUsers(supabase);

		return new Response(JSON.stringify({ data: users, fullSize: users.length } satisfies API.Users.List.Response), { status: 200 });
	} catch (error) {
		return RouteUtils.ServerError;
	}
}
