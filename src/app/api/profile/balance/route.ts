import { UsersControllers } from "@/controllers";
import { getCurrentUser, createSupabaseServer } from "@/services";

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
