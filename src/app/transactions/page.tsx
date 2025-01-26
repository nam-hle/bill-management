import React from "react";
import { type Metadata } from "next";
import { VStack } from "@chakra-ui/react";
import { IoIosAddCircle } from "react-icons/io";

import { createSupabaseServer } from "@/supabase/server";
import { LinkButton } from "@/components/ui/link-button";
import { TransactionsTable } from "@/components/app/transactions-table";
import { TransactionsControllers } from "@/controllers/transactions.controllers";

export const metadata: Metadata = {
	title: "Transactions"
};

export default async function BillsPage() {
	const supabase = await createSupabaseServer();

	const {
		data: { user: currentUser }
	} = await supabase.auth.getUser();

	if (!currentUser) {
		throw new Error("User not found");
	}

	const { fullSize, transactions } = await TransactionsControllers.getMany(supabase);

	return (
		<VStack gap="{spacing.4}" alignItems="flex-start">
			<TransactionsTable
				showFilters
				showFullSize
				showPagination
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
