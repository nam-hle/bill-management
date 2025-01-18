import React from "react";
import { VStack } from "@chakra-ui/react";

import { createClient } from "@/supabase/server";
import { BillsTable } from "@/components/app/bills-table";
import { BalancesTable } from "@/components/app/balances-table";
import { UsersControllers } from "@/controllers/users.controllers";
import { BillsControllers } from "@/controllers/bills.controllers";
import { BillMembersControllers } from "@/controllers/bill-members.controllers";

interface Props {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BillsPage(props: Props) {
	const searchParams = await props.searchParams;
	const { creditor, debtor } = searchParams;

	const supabase = await createClient();

	const {
		data: { user: currentUser }
	} = await supabase.auth.getUser();

	if (!currentUser) {
		throw new Error("User not found");
	}

	if (Array.isArray(creditor)) {
		throw new Error("Expected a single userId");
	}

	if (Array.isArray(debtor)) {
		throw new Error("Expected a single userId");
	}

	const users = await UsersControllers.getUsers(supabase);
	const bills = await BillsControllers.getBillsByMemberId(supabase, {
		memberId: currentUser.id,
		creditorId: creditor === "me" ? currentUser.id : creditor,
		debtorId: debtor === "me" ? currentUser.id : debtor
	});

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
			<BillsTable bills={bills ?? []} />
			<BalancesTable balances={balances} users={users ?? []} />
		</VStack>
	);
}
