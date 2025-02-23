import React from "react";

import { BillCardsList } from "@/components/bill-cards-list";
import { FinancialSummary } from "@/components/financial-summary";
import { TransactionCardList } from "@/components/transaction-cards-list";

import { getCurrentUser } from "@/services/supabase/server";

export default async function DashboardPage() {
	const currentUser = await getCurrentUser();

	return (
		<>
			<div className="grid grid-cols-6 gap-4">
				<FinancialSummary />
				<BillCardsList currentUserId={currentUser.id} />
				<TransactionCardList currentUserId={currentUser.id} />
			</div>
		</>
	);
}
