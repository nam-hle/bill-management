import { type UserFormState } from "@/types";
import { createClient } from "@/supabase/server";
import { UsersControllers } from "@/controllers/users.controllers";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const payload = body as UserFormState;
		const supabase = await createClient();

		if (!payload.username) {
			throw new Error("username is required");
		}

		const userData = UsersControllers.createUser(supabase, { username: payload.username });

		console.log("User successfully inserted:", userData);

		return new Response(JSON.stringify({ success: true, data: { userData } }), {
			status: 201
		});
	} catch (error) {
		console.error("Error creating bill:", error);

		return new Response(
			JSON.stringify({
				error: "Internal Server Error",
				details: (error as any).message
			}),
			{ status: 500 }
		);
	}
}
