import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { createSupabaseServer } from "@/services/supabase/server";

export async function POST(req: NextRequest) {
	const supabase = await createSupabaseServer();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	if (user) {
		await supabase.auth.signOut();
	}

	revalidatePath("/", "layout");

	return NextResponse.redirect(new URL("/login", req.url), { status: 302 });
}
