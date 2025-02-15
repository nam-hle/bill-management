import type { NextRequest } from "next/server";

import { API } from "@/api";
import { RouteUtils } from "@/route.utils";
import { BankAccountsController } from "@/controllers";
import { createSupabaseServer } from "@/services/supabase/server";

export async function GET(request: NextRequest) {
	try {
		const supabase = await createSupabaseServer();

		const searchParams = await RouteUtils.parseRequestSearchParams(request, API.BankAccounts.List.SearchParamsSchema);

		if (!searchParams) {
			return RouteUtils.BadRequest;
		}

		const response = await BankAccountsController.getByUserId(supabase, searchParams.userId);

		return new Response(JSON.stringify(response), { status: 200 });
	} catch (error) {
		return RouteUtils.ServerError;
	}
}
