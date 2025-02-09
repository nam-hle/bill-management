import type { NextRequest } from "next/server";

import { API } from "@/api";
import { createSupabaseServer } from "@/services/supabase/server";
import { BankAccountsController } from "@/controllers/bank-accounts.controller";

export async function GET(request: NextRequest) {
	try {
		const supabase = await createSupabaseServer();

		const { searchParams } = request.nextUrl;
		const result = API.BankAccounts.List.SearchParamsSchema.safeParse(Object.fromEntries(searchParams));

		if (result.error) {
			return new Response(JSON.stringify({ details: result.error.errors, error: "Invalid request query" }), { status: 400 });
		}

		const response = await BankAccountsController.getByUserId(supabase, result.data.userId);

		return new Response(JSON.stringify(response), { status: 200 });
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
