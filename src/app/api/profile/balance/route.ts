import { UsersControllers } from "@/controllers/users.controllers";
import { getCurrentUser, createSupabaseServer } from "@/supabase/server";

export async function GET() {
	try {
		const supabase = await createSupabaseServer();
		const currentUser = await getCurrentUser();

		const report = await UsersControllers.reportUsingView(supabase, currentUser.id);

		return new Response(JSON.stringify(report), { status: 200 });
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
