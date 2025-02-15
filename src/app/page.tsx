import React from "react";
import { Stack } from "@chakra-ui/react";
import { MdArrowRightAlt } from "react-icons/md";

import { LinkButton } from "@/chakra/link-button";
import { BalanceReport } from "@/components/balance-report";
import { getCurrentUser } from "@/services/supabase/server";
import { BillsTable, TransactionsTable } from "@/components/tables";

export default async function DashboardPage() {
	const currentUser = await getCurrentUser();

	return (
		<Stack gap={6}>
			<BalanceReport />
			<BillsTable
				title="Recent bills"
				currentUserId={currentUser.id}
				action={
					<LinkButton href="/bills" variant="subtle" colorScheme="blue">
						View All <MdArrowRightAlt />
					</LinkButton>
				}
			/>
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
		</Stack>
	);
}
