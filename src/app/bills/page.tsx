import React from "react";
import { type Metadata } from "next";
import { VStack } from "@chakra-ui/react";
import { IoIosAddCircle } from "react-icons/io";

import { LinkButton } from "@/chakra/link-button";
import { BillsTable } from "@/components/bills-table";
import { BalancesTable } from "@/components/balances-table";
import { UsersControllers } from "@/controllers/users.controllers";
import { BillsControllers } from "@/controllers/bills.controllers";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from "@/constants";
import { BillMembersControllers } from "@/controllers/bill-members.controllers";
import { getCurrentUser, createSupabaseServer } from "@/services/supabase/server";

export const metadata: Metadata = {
	title: "Bills"
};

interface Props {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BillsPage(props: Props) {
	const searchParams = await props.searchParams;
	const { page, since, debtor, search, creator, creditor } = searchParams;

	const supabase = await createSupabaseServer();
	const currentUser = await getCurrentUser();

	if (Array.isArray(creditor)) {
		throw new Error("Expected a single userId");
	}

	if (Array.isArray(debtor)) {
		throw new Error("Expected a single userId");
	}

	if (Array.isArray(creator)) {
		throw new Error("Expected a single userId");
	}

	if (Array.isArray(since)) {
		throw new Error("Expected a single userId");
	}

	if (Array.isArray(page)) {
		throw new Error("Expected a single userId");
	}

	if (Array.isArray(search)) {
		throw new Error("Expected a single userId");
	}

	const users = await UsersControllers.getUsers(supabase);
	const { bills, fullSize } = await BillsControllers.getManyByMemberId(
		supabase,
		{
			since,
			memberId: currentUser.id,
			textSearch: search || undefined,
			debtorId: debtor === "me" ? currentUser.id : debtor,
			creatorId: creator === "me" ? currentUser.id : creator,
			creditorId: creditor === "me" ? currentUser.id : creditor
		},
		{ pageSize: DEFAULT_PAGE_SIZE, pageNumber: page ? parseInt(page, 10) : DEFAULT_PAGE_NUMBER }
	);

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
				mode="advance"
				fullSize={fullSize}
				bills={bills ?? []}
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
