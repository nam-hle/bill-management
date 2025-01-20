import React from "react";
import { MdArrowRightAlt } from "react-icons/md";
import { Stack, HStack, Heading, Separator } from "@chakra-ui/react";

import { createClient } from "@/supabase/server";
import { LinkButton } from "@/components/ui/link-button";
import { BillsTable } from "@/components/app/bills-table";
import { UsersControllers } from "@/controllers/users.controllers";
import { BillsControllers } from "@/controllers/bills.controllers";
import { StatRoot, StatLabel, StatValueText } from "@/components/ui/stat";

export default async function DashboardPage() {
	const supabase = await createClient();

	const {
		data: { user: currentUser }
	} = await supabase.auth.getUser();

	if (!currentUser) {
		throw new Error("User not found");
	}

	const balance = await UsersControllers.getBalance(supabase, currentUser.id);
	const bills = await BillsControllers.getBillsByMemberId(supabase, { memberId: currentUser.id });

	return (
		<Stack gap={6}>
			<Stack gap={2}>
				<Heading as="h1">Balance</Heading>

				<HStack mb={2} justify="space-between">
					<StatRoot>
						<StatLabel info="The total amount you need to pay back to others">Owed</StatLabel>
						<StatValueText value={balance.owed} />
					</StatRoot>
					<StatRoot>
						<StatLabel info="The total amount you have paid on behalf of others">Paid</StatLabel>
						<StatValueText value={balance.paid} />
					</StatRoot>
					<StatRoot>
						<StatLabel>Net Balance</StatLabel>
						<StatValueText value={balance.net} />
					</StatRoot>
				</HStack>
			</Stack>

			<Separator variant="solid" />

			<BillsTable
				bills={bills}
				title="Recent bills"
				currentUserId={currentUser.id}
				action={
					<LinkButton href="/bills" variant="subtle" colorScheme="blue">
						View All <MdArrowRightAlt />
					</LinkButton>
				}
			/>
		</Stack>
	);
}
