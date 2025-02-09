import React from "react";
import { Stack } from "@chakra-ui/react";

import { RecentBills } from "@/components/recent-bills";
import { BalanceReport } from "@/components/balance-report";
import { RecentTransactions } from "@/components/recent-transactions";

export default async function DashboardPage() {
	return (
		<Stack gap={6}>
			<BalanceReport />
			<RecentBills />
			<RecentTransactions />
		</Stack>
	);
}
