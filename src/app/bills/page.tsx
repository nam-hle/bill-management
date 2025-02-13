import React from "react";
import { type Metadata } from "next";
import { VStack } from "@chakra-ui/react";
import { IoIosAddCircle } from "react-icons/io";

import { LinkButton } from "@/chakra/link-button";
import { BillsTable } from "@/components/bills-table";
import { BalancesTable } from "@/components/balances-table";
import { UsersControllers, BillMembersControllers } from "@/controllers";
import { getCurrentUser, createSupabaseServer } from "@/services/supabase/server";

export const metadata: Metadata = {
	title: "Bills"
};

export default async function BillsPage() {
	const supabase = await createSupabaseServer();
	const currentUser = await getCurrentUser();

	const users = await UsersControllers.getUsers(supabase);

	const membersData = await BillMembersControllers.getAll(supabase);

	const balances = membersData.reduce(
		(acc, member) => {
			const balanceChange = member.role === "Creditor" ? member.amount : -member.amount;
			acc[member.userId] = (acc[member.userId] || 0) + balanceChange;

			return acc;
		},
		{} as Record<string, number>
	);

	return (
		<VStack gap="{spacing.4}" alignItems="flex-start">
			<BillsTable
				advanced
				currentUserId={currentUser.id}
				action={
					<LinkButton size="sm" variant="solid" href="/bills/new">
						<IoIosAddCircle /> New
					</LinkButton>
				}
			/>
			<BalancesTable balances={balances} users={users ?? []} />
		</VStack>
	);
}
