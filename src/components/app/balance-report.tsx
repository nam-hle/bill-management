import React from "react";
import { Stack, HStack, Heading } from "@chakra-ui/react";

import { createSupabaseServer } from "@/supabase/server";
import { UsersControllers } from "@/controllers/users.controllers";
import { StatRoot, StatLabel, StatValueText } from "@/components/ui/stat";
import { TransactionsControllers } from "@/controllers/transactions.controllers";

export async function BalanceReport() {
	const supabase = await createSupabaseServer();

	const {
		data: { user: currentUser }
	} = await supabase.auth.getUser();

	if (!currentUser) {
		throw new Error("User not found");
	}

	const balance = await UsersControllers.getBalance(supabase, currentUser.id);
	const { sent, received } = await TransactionsControllers.report(supabase, currentUser.id);

	return (
		<Stack gap={2}>
			<Heading as="h1">Balance</Heading>

			<HStack justify="space-between">
				<StatRoot>
					<StatLabel info="The total amount you need to pay back to others">Owed</StatLabel>
					<StatValueText color="blue.400" value={balance.owed} />
				</StatRoot>
				<StatRoot>
					<StatLabel info="The total amount you have received by transactions by others">Received</StatLabel>
					<StatValueText color="blue.400" value={(received ?? "N/A") as number} />
				</StatRoot>
				<StatRoot>
					<StatLabel info="The total amount you have paid on behalf of others">Paid</StatLabel>
					<StatValueText color="red.400" value={-balance.paid} />
				</StatRoot>
				<StatRoot>
					<StatLabel info="The total amount you sent by transactions to others">Sent</StatLabel>
					<StatValueText color="red.400" value={-(sent ?? "N/A") as number} />
				</StatRoot>
				<StatRoot>
					<StatLabel>Net Balance</StatLabel>
					<StatValueText value={balance.net} />
				</StatRoot>
			</HStack>
		</Stack>
	);
}
