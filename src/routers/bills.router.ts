import { API } from "@/api";
import type { BillMemberRole } from "@/schemas";
import { getCurrentUser } from "@/services/supabase/server";
import { router, privateProcedure } from "@/services/trpc/server";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from "@/constants";
import { BillsControllers, BillMembersControllers } from "@/controllers";

export const billsRouter = router({
	get: privateProcedure.input(API.Bills.Get.PayloadSchema).query(({ input, ctx: { supabase } }) => BillsControllers.getById(supabase, input.id)),
	update: privateProcedure.input(API.Bills.Update.PayloadSchema).mutation(async ({ input, ctx: { supabase, user: updater } }) => {
		const { debtors, issuedAt, creditor, id: billId, description, receiptFile } = input;

		// Members need to be updated first
		await BillMembersControllers.updateMany(supabase, updater.id, { billId, nextDebtors: debtors });

		await BillsControllers.updateById(supabase, billId, {
			issuedAt,
			receiptFile,
			description,
			updaterId: updater.id,
			creditorId: creditor.userId,
			totalAmount: creditor.amount
		});
	}),
	create: privateProcedure.input(API.Bills.UpsertBillSchema).mutation(async ({ input, ctx: { supabase } }) => {
		const { debtors, issuedAt, creditor, description, receiptFile } = input;
		const creator = await getCurrentUser();

		// Step 1: Insert bill
		const bill = await BillsControllers.create(supabase, {
			issuedAt,
			description,
			receiptFile,
			creatorId: creator.id,
			creditorId: creditor.userId,
			totalAmount: creditor.amount
		});

		const billMembers = debtors.map(({ userId, amount }) => {
			return { userId, amount, billId: bill.id, role: "Debtor" as BillMemberRole };
		});

		await BillMembersControllers.createMany(supabase, creator.id, billMembers);
	}),
	getMany: privateProcedure
		.input(API.Bills.List.PayloadSchema)
		.output(API.Bills.List.ResponseSchema)
		.query(async ({ ctx, input }) => {
			const { user, supabase } = ctx;
			const currentUserId = user.id;
			const { page, debtor, creator, creditor, ...rest } = input;

			const resolvedSearchParams: BillsControllers.GetManyByMemberIdPayload = {
				...rest,
				member: currentUserId,
				limit: DEFAULT_PAGE_SIZE,
				page: page ?? DEFAULT_PAGE_NUMBER,
				debtor: debtor === "me" ? currentUserId : undefined,
				creator: creator === "me" ? currentUserId : undefined,
				creditor: creditor === "me" ? currentUserId : undefined
			};

			return BillsControllers.getManyByMemberId(supabase, resolvedSearchParams);
		})
});
