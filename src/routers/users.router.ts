import { z } from "zod";

import { API } from "@/api";
import { UsersControllers } from "@/controllers";
import { router, privateProcedure } from "@/services/trpc/server";
import { GroupSchema, InviteSchema } from "@/schemas/group.schema";

export const usersRouter = router({
	get: privateProcedure.output(API.Users.List.ResponseSchema).query(async ({ ctx: { supabase } }) => {
		const users = await UsersControllers.getUsers(supabase);

		return { data: users, fullSize: users.length } satisfies API.Users.List.Response;
	}),

	invites: privateProcedure
		.output(z.array(InviteSchema))
		.query(({ ctx: { user, supabase } }) => UsersControllers.getGroupInvites(supabase, { userId: user.id })),
	requests: privateProcedure
		.output(z.array(GroupSchema))
		.query(({ ctx: { user, supabase } }) => UsersControllers.getGroupRequests(supabase, { userId: user.id })),

	findByName: privateProcedure
		.input(z.object({ textSearch: z.string() }))
		.output(API.Users.List.ResponseSchema)
		.query(({ input, ctx: { supabase } }) => UsersControllers.findByName(supabase, input))
});
