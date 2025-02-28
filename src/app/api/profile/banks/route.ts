import { RouteUtils } from "@/route.utils";
import { BankAccountsController } from "@/controllers";
import { BankAccountCreatePayloadSchema } from "@/schemas";
import { getCurrentUser, createSupabaseServer } from "@/services/supabase/server";

export async function POST(request: Request) {
	try {
		const supabase = await createSupabaseServer();

		const body = await RouteUtils.parseRequestBody(request, BankAccountCreatePayloadSchema);

		if (!body) {
			return RouteUtils.BadRequest;
		}

		const currentUser = await getCurrentUser();

		await BankAccountsController.create(supabase, currentUser.id, body);

		return new Response(JSON.stringify({ ok: true }), { status: 201 });
	} catch (error) {
		return RouteUtils.ServerError;
	}
}
