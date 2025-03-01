import { API } from "@/api";
import { TransactionsControllers } from "@/controllers";
import { router, privateProcedure } from "@/services/trpc/server";

export const transactionsRouter = router({
	update: privateProcedure
		.input(API.Transactions.Update.PayloadSchema)
		.mutation(({ input, ctx: { supabase } }) => TransactionsControllers.update(supabase, input)),
	suggest: privateProcedure
		.output(API.Transactions.Suggestion.ResponseSchema)
		.query(({ ctx: { user, supabase } }) => TransactionsControllers.suggest(supabase, user.id)),
	get: privateProcedure
		.input(API.Transactions.List.PayloadSchema)
		.output(API.Transactions.List.ResponseSchema)
		.query(({ input, ctx: { supabase } }) => TransactionsControllers.getMany(supabase, input)),
	create: privateProcedure.input(API.Transactions.Create.PayloadSchema).mutation(async ({ input, ctx: { supabase, user: sender } }) => {
		const { amount, issuedAt, receiverId, bankAccountId } = input;

		await TransactionsControllers.create(supabase, {
			amount,
			issuedAt,
			receiverId,
			bankAccountId,
			senderId: sender.id
		});
	})
});
