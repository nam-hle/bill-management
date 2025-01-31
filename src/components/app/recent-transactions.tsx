import React from "react";
import { MdArrowRightAlt } from "react-icons/md";

import { getCurrentUser } from "@/supabase/server";
import { LinkButton } from "@/components/ui/link-button";
import { TransactionsTable } from "@/components/app/transactions-table";

export async function RecentTransactions() {
	const currentUser = await getCurrentUser();

	return (
		<TransactionsTable
			mode="basic"
			title="Recent transactions"
			currentUserId={currentUser.id}
			action={
				<LinkButton variant="subtle" colorScheme="blue" href="/transactions">
					View All <MdArrowRightAlt />
				</LinkButton>
			}
		/>
	);
}
