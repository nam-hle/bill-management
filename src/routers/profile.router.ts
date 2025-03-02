import { z } from "zod";
import { revalidatePath } from "next/cache";

import { API } from "@/api";
import { BalanceSchema } from "@/types";
import { GroupSchema } from "@/schemas/group.schema";
import { router, privateProcedure } from "@/services/trpc/server";
import { UsersControllers, BankAccountsController } from "@/controllers";
import { ProfileFormPayloadSchema, BankAccountCreatePayloadSchema } from "@/schemas";

export const profileRouter = router({
	getBalance: privateProcedure.output(BalanceSchema).query(({ ctx: { user, supabase } }) => UsersControllers.reportUsingView(supabase, user.id)),
	createBankAccount: privateProcedure
		.input(BankAccountCreatePayloadSchema)
		.mutation(({ input, ctx: { user, supabase } }) => BankAccountsController.create(supabase, user.id, input)),
	getBankAccounts: privateProcedure
		.input(API.BankAccounts.List.SearchParamsSchema)
		.output(API.BankAccounts.List.ResponseSchema)
		.query(({ input, ctx: { supabase } }) => BankAccountsController.getByUserId(supabase, input.userId)),

	update: privateProcedure
		.input(ProfileFormPayloadSchema)
		.output(ProfileFormPayloadSchema)
		.mutation(async ({ input, ctx: { user, supabase } }) => {
			// TODO: Check it work
			revalidatePath("/", "layout");

			const { avatar, fullName } = await UsersControllers.updateProfile(supabase, user.id, input);

			return { fullName, avatarUrl: avatar };
		}),

	groups: privateProcedure
		.output(z.array(GroupSchema))
		.query(({ ctx: { user, supabase } }) => UsersControllers.getGroups(supabase, { userId: user.id })),
	selectedGroup: privateProcedure
		.output(GroupSchema.nullable())
		.query(({ ctx: { user, supabase } }) => UsersControllers.getSelectedGroup(supabase, user.id)),
	selectGroup: privateProcedure
		.input(z.object({ groupId: z.string() }))
		.mutation(({ input, ctx: { user, supabase } }) => UsersControllers.selectGroup(supabase, { userId: user.id, groupId: input.groupId }))
});
