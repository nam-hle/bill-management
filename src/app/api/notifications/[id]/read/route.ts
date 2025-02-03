import { type APIPayload } from "@/types";
import { getCurrentUser, createSupabaseServer } from "@/supabase/server";
import { NotificationsControllers } from "@/controllers/notifications.controllers";

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const notificationId = (await params).id;
		const supabase = await createSupabaseServer();
		const currentUser = await getCurrentUser();

		const unreadCount = await NotificationsControllers.read(supabase, currentUser.id, notificationId);

		return new Response(JSON.stringify({ unreadCount } satisfies APIPayload.Notification.ReadNotificationResponse), { status: 201 });
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
