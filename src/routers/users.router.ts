import { API } from "@/api";
import { UsersControllers } from "@/controllers";
import { router, privateProcedure } from "@/services/trpc/server";

export const usersRouter = router({
	get: privateProcedure.output(API.Users.List.ResponseSchema).query(async ({ ctx: { supabase } }) => {
		const users = await UsersControllers.getUsers(supabase);

		return { data: users, fullSize: users.length } satisfies API.Users.List.Response;
	})
});
