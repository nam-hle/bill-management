import { type NextRequest } from "next/server";

import { API } from "@/api";
import { NotificationsControllers } from "@/controllers";
import { getCurrentUser, createSupabaseServer } from "@/services";

export async function GET(request: NextRequest) {
	try {
		const supabase = await createSupabaseServer();

		const params = API.Notifications.List.SearchParamsSchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));

		if (params.error) {
			return new Response(JSON.stringify({ details: params.error.errors, error: "Invalid request query" }), { status: 400 });
		}

		const currentUser = await getCurrentUser();

		const result = await NotificationsControllers.getByUserId(supabase, currentUser.id, params.data);

		return new Response(JSON.stringify(result), { status: 200 });
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
