import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { type NextRequest } from "next/server";

import { LoginFormPayloadSchema } from "@/types";
import { createClient } from "@/supabase/server";

export async function POST(req: NextRequest) {
	const body = LoginFormPayloadSchema.safeParse(await req.json());

	if (body.error) {
		return new Response(JSON.stringify({ details: body.error.errors, error: "Invalid request body" }), {
			status: 400
		});
	}

	const supabase = await createClient();
	const { error } = await supabase.auth.signInWithPassword(body.data);

	if (error) {
		return new Response(
			JSON.stringify({
				details: error.message,
				error: "Internal Server Error"
			}),
			{ status: 400 }
		);
	} else {
		revalidatePath("/", "layout");
		redirect("/");
	}
}
