import React from "react";
import { MdArrowRightAlt } from "react-icons/md";

import { LinkButton } from "@/components/ui/link-button";
import { TransactionsTable } from "@/components/app/transactions-table";
import { getCurrentUser, createSupabaseServer } from "@/supabase/server";
import { TransactionsControllers } from "@/controllers/transactions.controllers";

export async function RecentTransactions() {
	const supabase = await createSupabaseServer();
	const currentUser = await getCurrentUser();

	const { count, transactions } = await TransactionsControllers.getByUserId(supabase, {
		userId: currentUser.id,
		pagination: { pageSize: 5, pageNumber: 1 }
	});

	return (
		<TransactionsTable
			fullSize={count}
			title="Recent transactions"
			transactions={transactions}
			currentUserId={currentUser.id}
			action={
				<LinkButton variant="subtle" colorScheme="blue" href="/transactions">
					View All <MdArrowRightAlt />
				</LinkButton>
			}
		/>
	);
}
