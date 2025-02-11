import { revalidatePath } from "next/cache";

import { ProfileFormPayloadSchema } from "@/schemas";
import { UsersControllers } from "@/controllers/users.controllers";
import { getCurrentUser, createSupabaseServer } from "@/services/supabase/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const supabase = await createSupabaseServer();

		const parsedBody = ProfileFormPayloadSchema.safeParse(body);

		if (parsedBody.error) {
			return new Response(JSON.stringify({ error: "Invalid request body", details: parsedBody.error.errors }), {
				status: 400
			});
		}

		const user = await getCurrentUser();

		revalidatePath("/", "layout");

		const { fullName, avatarUrl } = await UsersControllers.updateProfile(supabase, user.id, parsedBody.data);

		return new Response(JSON.stringify({ fullName, avatarUrl }), {
			status: 201
		});
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
