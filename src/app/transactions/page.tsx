import React from "react";
import { type Metadata } from "next";
import { VStack } from "@chakra-ui/react";
import { IoIosAddCircle } from "react-icons/io";

import { getCurrentUser } from "@/supabase/server";
import { LinkButton } from "@/components/ui/link-button";
import { TransactionsTable } from "@/components/app/transactions-table";

export const metadata: Metadata = {
	title: "Transactions"
};

export default async function TransactionsPage() {
	const currentUser = await getCurrentUser();

	return (
		<VStack gap="{spacing.4}" alignItems="flex-start">
			<TransactionsTable
				mode="advance"
				currentUserId={currentUser.id}
				action={
					<LinkButton size="sm" variant="solid" href="/transactions/new">
						<IoIosAddCircle /> New
					</LinkButton>
				}
			/>
		</VStack>
	);
}
