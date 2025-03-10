import { z } from "zod";

import { UsersControllers } from "@/controllers";
import { router, privateProcedure } from "@/services/trpc/server";
import { GroupSchema, InviteSchema } from "@/schemas/group.schema";

export const usersRouter = router({
	invites: privateProcedure
		.output(z.array(InviteSchema))
		.query(({ ctx: { user, supabase } }) => UsersControllers.getGroupInvites(supabase, { userId: user.id })),
	requests: privateProcedure
		.output(z.array(GroupSchema))
		.query(({ ctx: { user, supabase } }) => UsersControllers.getGroupRequests(supabase, { userId: user.id }))
});
