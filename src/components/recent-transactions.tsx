import React from "react";
import { MdArrowRightAlt } from "react-icons/md";

import { LinkButton } from "@/chakra/link-button";
import { getCurrentUser } from "@/services/supabase/server";
import { TransactionsTable } from "@/components/transactions-table";

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
