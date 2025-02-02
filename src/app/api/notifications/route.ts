import { type NextRequest } from "next/server";

import { API } from "@/api";
import { getCurrentUser, createSupabaseServer } from "@/supabase/server";
import { NotificationsControllers } from "@/controllers/notifications.controllers";

export async function GET(request: NextRequest) {
	try {
		const supabase = await createSupabaseServer();

		const result = API.Notifications.List.SearchParamsSchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));

		if (result.error) {
			return new Response(JSON.stringify({ details: result.error.errors, error: "Invalid request query" }), { status: 400 });
		}

		const currentUser = await getCurrentUser();

		const { count, hasOlder, notifications } = await NotificationsControllers.getByUserId(supabase, {
			timestamp: result.data,
			userId: currentUser.id
		});

		return new Response(JSON.stringify({ count, hasOlder, success: true, notifications }), { status: 200 });
	} catch (error) {
		console.log(error);

		return new Response(
			JSON.stringify({
				error: "Internal Server Error",
				details: (error as any).message
			}),
			{ status: 500 }
		);
	}
}
