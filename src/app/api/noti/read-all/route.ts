import { createClient } from "@/supabase/server";
import { NotificationsControllers } from "@/controllers/notifications.controllers";

export async function PUT() {
	try {
		const supabase = await createClient();

		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("User not found");
		}

		await NotificationsControllers.readAll(supabase, user.id);

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
