import { type API } from "@/api";
import { UsersControllers } from "@/controllers";
import { createSupabaseServer } from "@/services/supabase/server";

export async function GET() {
	try {
		const supabase = await createSupabaseServer();

		const users = await UsersControllers.getUsers(supabase);

		return new Response(JSON.stringify({ data: users, fullSize: users.length } satisfies API.Users.List.Response), { status: 200 });
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
