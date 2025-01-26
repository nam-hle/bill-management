import React from "react";
import { type Metadata } from "next";
import { VStack } from "@chakra-ui/react";
import { IoIosAddCircle } from "react-icons/io";

import { LinkButton } from "@/components/ui/link-button";
import { TransactionsTable } from "@/components/app/transactions-table";
import { getCurrentUser, createSupabaseServer } from "@/supabase/server";
import { TransactionsControllers } from "@/controllers/transactions.controllers";

export const metadata: Metadata = {
	title: "Transactions"
};

export default async function BillsPage() {
	const supabase = await createSupabaseServer();
	const currentUser = await getCurrentUser();

	const { fullSize, transactions } = await TransactionsControllers.getMany(supabase);

	return (
		<VStack gap="{spacing.4}" alignItems="flex-start">
			<TransactionsTable
				mode="advance"
				fullSize={fullSize}
				transactions={transactions}
				currentUserId={currentUser.id}
				action={
					<LinkButton variant="solid" href="/transactions/new">
						<IoIosAddCircle /> New
					</LinkButton>
				}
			/>
		</VStack>
	);
}
