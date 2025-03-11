import { z } from "zod";

import { BalanceSchema } from "@/types";
import { UserControllers, BankAccountsController } from "@/controllers";
import { router, publicProcedure, privateProcedure, withSelectedGroup } from "@/services/trpc/server";
import {
	GroupSchema,
	InviteSchema,
	ProfileSchema,
	BankAccountSchema,
	TrpcResponseSchema,
	LoginFormStateSchema,
	SignUpFormStateSchema,
	ProfileFormStateSchema,
	BankAccountCreatePayloadSchema
} from "@/schemas";

export const userRouter = router({
	login: publicProcedure
		.input(LoginFormStateSchema)
		.output(TrpcResponseSchema)
		.mutation(({ input, ctx: { supabase } }) => UserControllers.login(supabase, input)),
	signUp: publicProcedure
		.input(SignUpFormStateSchema)
		.output(TrpcResponseSchema)
		.mutation(({ input, ctx: { supabase } }) => UserControllers.signUp(supabase, input)),

	profile: privateProcedure.output(ProfileSchema).query(({ ctx: { user, supabase } }) => UserControllers.getProfile(supabase, user.id)),
	updateProfile: privateProcedure
		.input(ProfileFormStateSchema)
		.output(ProfileFormStateSchema)
		// FIXME: The current top avatar did not update accordingly
		.mutation(async ({ input, ctx: { user, supabase } }) => UserControllers.updateProfile(supabase, user.id, input)),

	createBankAccount: privateProcedure
		.input(BankAccountCreatePayloadSchema)
		.mutation(({ input, ctx: { user, supabase } }) => BankAccountsController.create(supabase, user.id, input)),
	getBalance: privateProcedure
		.use(withSelectedGroup)
		.output(BalanceSchema)
		.query(({ ctx: { user, supabase } }) => UserControllers.reportUsingView(supabase, { userId: user.id, groupId: user.group.id })),
	getBankAccounts: privateProcedure
		.input(z.object({ userId: z.string() }))
		.output(z.array(BankAccountSchema))
		.query(({ input, ctx: { supabase } }) => BankAccountsController.getByUserId(supabase, input.userId)),

	groups: privateProcedure
		.output(z.array(GroupSchema))
		.query(({ ctx: { user, supabase } }) => UserControllers.getGroups(supabase, { userId: user.id })),
	selectedGroup: privateProcedure
		.output(GroupSchema.extend({ balance: z.number() }).nullable())
		.query(({ ctx: { user, supabase } }) => UserControllers.getSelectedGroup(supabase, user.id)),
	selectGroup: privateProcedure
		.input(z.object({ groupId: z.string().nullable() }))
		.mutation(({ input, ctx: { user, supabase } }) => UserControllers.selectGroup(supabase, { userId: user.id, groupId: input.groupId })),

	invites: privateProcedure
		.output(z.array(InviteSchema))
		.query(({ ctx: { user, supabase } }) => UserControllers.getGroupInvites(supabase, { userId: user.id })),
	requests: privateProcedure
		.output(z.array(GroupSchema))
		.query(({ ctx: { user, supabase } }) => UserControllers.getGroupRequests(supabase, { userId: user.id }))
});
