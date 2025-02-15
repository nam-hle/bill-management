import { revalidatePath } from "next/cache";

import { RouteUtils } from "@/route.utils";
import { UsersControllers } from "@/controllers";
import { ProfileFormPayloadSchema } from "@/schemas";
import { getCurrentUser, createSupabaseServer } from "@/services/supabase/server";

export async function POST(request: Request) {
	try {
		const supabase = await createSupabaseServer();

		const body = await RouteUtils.parseRequestBody(request, ProfileFormPayloadSchema);

		if (!body) {
			return RouteUtils.BadRequest;
		}

		const user = await getCurrentUser();

		revalidatePath("/", "layout");

		const { fullName, avatarUrl } = await UsersControllers.updateProfile(supabase, user.id, body);

		return new Response(JSON.stringify({ fullName, avatarUrl }), { status: 201 });
	} catch (error) {
		return RouteUtils.ServerError;
	}
}
