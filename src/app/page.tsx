import React from "react";
import { Stack } from "@chakra-ui/react";

import { RecentBills } from "@/components/app/recent-bills";
import { BalanceReport } from "@/components/app/balance-report";
import { RecentTransactions } from "@/components/app/recent-transactions";

export default async function DashboardPage() {
	return (
		<Stack gap={6}>
			<BalanceReport />
			{/*<Separator variant="solid" />*/}
			<RecentBills />
			{/*<Separator variant="solid" />*/}
			<RecentTransactions />
		</Stack>
	);
}
