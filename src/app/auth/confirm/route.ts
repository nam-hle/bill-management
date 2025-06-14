import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { createSupabaseServer } from "@/services/supabase/server";

// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const token_hash = searchParams.get("token_hash");
	const type = searchParams.get("type") as EmailOtpType | null;
	const next = "/profile";

	// Create redirect link without the secret token
	const redirectTo = request.nextUrl.clone();
	redirectTo.pathname = next;
	redirectTo.searchParams.delete("token_hash");
	redirectTo.searchParams.delete("type");

	if (token_hash && type) {
		const supabase = await createSupabaseServer();

		const { error } = await supabase.auth.verifyOtp({
			type,
			token_hash
		});

		if (!error) {
			redirectTo.searchParams.delete("next");

			return NextResponse.redirect(redirectTo);
		}
	}

	// return the user to an error page with some instructions
	redirectTo.pathname = "/error";

	return NextResponse.redirect(redirectTo);
}
