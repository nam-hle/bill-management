import { z } from "zod";

import { API } from "@/api";
import { ClientTransactionSchema } from "@/schemas";
import { TransactionsControllers } from "@/controllers";
import { router, privateProcedure, withSelectedGroup } from "@/services/trpc/server";

export const transactionsRouter = router({
	get: privateProcedure
		.input(z.object({ transactionId: z.string() }))
		.output(ClientTransactionSchema)
		.query(({ input, ctx: { user, supabase } }) => TransactionsControllers.getById(supabase, { ...input, userId: user.id })),
	getMany: privateProcedure
		.use(withSelectedGroup)
		.input(API.Transactions.List.PayloadSchema)
		.output(API.Transactions.List.ResponseSchema)
		.query(({ input, ctx: { user, supabase } }) => TransactionsControllers.getMany(supabase, user, input)),

	suggest: privateProcedure
		.output(API.Transactions.Suggestion.ResponseSchema)
		.query(({ ctx: { user, supabase } }) => TransactionsControllers.suggest(supabase, user.id)),
	update: privateProcedure
		.use(withSelectedGroup)
		.input(API.Transactions.Update.PayloadSchema)
		.mutation(({ input, ctx: { supabase } }) => TransactionsControllers.update(supabase, input)),
	create: privateProcedure
		.use(withSelectedGroup)
		.input(API.Transactions.Create.PayloadSchema)
		.mutation(async ({ input, ctx: { supabase, user: sender } }) => {
			const { amount, issuedAt, receiverId, bankAccountId } = input;

			await TransactionsControllers.create(supabase, {
				amount,
				issuedAt,
				receiverId,
				bankAccountId,
				senderId: sender.id,
				groupId: sender.group.id
			});
		})
});
