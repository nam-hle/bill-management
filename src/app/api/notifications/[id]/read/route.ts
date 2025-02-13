import { type API } from "@/api";
import { NotificationsControllers } from "@/controllers";
import { getCurrentUser, createSupabaseServer } from "@/services/supabase/server";

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const notificationId = (await params).id;
		const supabase = await createSupabaseServer();
		const currentUser = await getCurrentUser();

		const unreadCount = await NotificationsControllers.read(supabase, currentUser.id, notificationId);

		return new Response(JSON.stringify({ unreadCount } satisfies API.Notifications.ReadResponse), { status: 201 });
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
