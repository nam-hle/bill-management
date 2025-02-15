import { type NextRequest } from "next/server";

import { API } from "@/api";
import { RouteUtils } from "@/route.utils";
import { NotificationsControllers } from "@/controllers";
import { getCurrentUser, createSupabaseServer } from "@/services/supabase/server";

export async function GET(request: NextRequest) {
	try {
		const supabase = await createSupabaseServer();
		const searchParams = await RouteUtils.parseRequestSearchParams(request, API.Bills.List.SearchParamsSchema);

		if (!searchParams) {
			return RouteUtils.BadRequest;
		}

		const currentUser = await getCurrentUser();

		const result = await NotificationsControllers.getByUserId(supabase, currentUser.id, searchParams);

		return new Response(JSON.stringify(result), { status: 200 });
	} catch (error) {
		return RouteUtils.ServerError;
	}
}
