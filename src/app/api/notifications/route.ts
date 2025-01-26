import { type NextRequest } from "next/server";

import { createSupabaseServer } from "@/supabase/server";
import { NotificationsControllers } from "@/controllers/notifications.controllers";

export async function GET(request: NextRequest) {
	try {
		const supabase = await createSupabaseServer();

		const searchParams = request.nextUrl.searchParams;
		const after = searchParams.get("after") ?? undefined;
		const before = searchParams.get("before") ?? undefined;

		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("User not found");
		}

		const { count, hasOlder, notifications } = await NotificationsControllers.getByUserId(supabase, {
			userId: user.id,
			timestamp: { after, before }
		});

		return new Response(JSON.stringify({ count, hasOlder, success: true, notifications }), { status: 200 });
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
