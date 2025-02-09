import { getCurrentUser, createSupabaseServer } from "@/services/supabase/server";
import { NotificationsControllers } from "@/controllers/notifications.controllers";

export async function PATCH() {
	try {
		const supabase = await createSupabaseServer();
		const currentUser = await getCurrentUser();

		await NotificationsControllers.readAll(supabase, currentUser.id);

		return new Response(JSON.stringify({ success: true }), { status: 200 });
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
