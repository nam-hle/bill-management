import React from "react";
import { Stack, HStack, Heading } from "@chakra-ui/react";

import { UsersControllers } from "@/controllers/users.controllers";
import { getCurrentUser, createSupabaseServer } from "@/supabase/server";
import { StatRoot, StatLabel, StatValueText } from "@/components/ui/stat";

export async function BalanceReport() {
	const supabase = await createSupabaseServer();
	const currentUser = await getCurrentUser();

	const { net, sent, paid, owed, received } = await UsersControllers.report(supabase, currentUser.id);

	return (
		<Stack gap={2}>
			<Heading as="h1">Balance</Heading>

			<HStack justify="space-between">
				<StatRoot>
					<StatLabel info="The total amount you need to pay back to others">Owed</StatLabel>
					<StatValueText value={owed} color="green.600" />
				</StatRoot>
				<StatRoot>
					<StatLabel info="The total amount you have received by transactions by others">Received</StatLabel>
					<StatValueText value={received} color="green.600" />
				</StatRoot>
				<StatRoot>
					<StatLabel info="The total amount you have paid on behalf of others">Paid</StatLabel>
					<StatValueText value={-paid} color="red.600" />
				</StatRoot>
				<StatRoot>
					<StatLabel info="The total amount you sent by transactions to others">Sent</StatLabel>
					<StatValueText value={-sent} color="red.600" />
				</StatRoot>
				<StatRoot>
					<StatLabel>Net Balance</StatLabel>
					<StatValueText value={net} color={net >= 0 ? "green.600" : "red:600"} />
				</StatRoot>
			</HStack>
		</Stack>
	);
}
