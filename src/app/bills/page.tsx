import React from "react";

import { createClient } from "@/supabase/server";
import { BillsTable } from "@/components/app/bills-table";
import { UsersControllers } from "@/controllers/users.controllers";
import { BillsControllers } from "@/controllers/bills.controllers";
import { BillMembersControllers } from "@/controllers/bill-members.controllers";

interface Props {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BillsPage(props: Props) {
	const userId = (await props.searchParams).userId;

	if (Array.isArray(userId)) {
		throw new Error("Expected a single userId");
	}

	const supabase = await createClient();
	const users = await UsersControllers.getUsers(supabase);
	const bills = await BillsControllers.getBillsByMemberId(supabase, userId);

	const membersData = await BillMembersControllers.getAll(supabase);

	const balances = membersData.reduce(
		(acc, member) => {
			const balanceChange = member.role === "Creditor" ? member.amount : -member.amount;
			acc[member.userId] = (acc[member.userId] || 0) + balanceChange;

			return acc;
		},
		{} as Record<string, number>
	);

	return <BillsTable balances={balances} bills={bills ?? []} users={users ?? []} />;
}
