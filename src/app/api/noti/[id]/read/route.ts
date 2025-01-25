import { createClient } from "@/supabase/server";
import { NotificationsControllers } from "@/controllers/notifications.controllers";

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const notificationId = (await params).id;

		const supabase = await createClient();

		const unreadCount = await NotificationsControllers.read(supabase, notificationId);

		return new Response(JSON.stringify({ unreadCount, success: true }), { status: 201 });
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
