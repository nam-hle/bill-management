import React from "react";

import { BillCardsList } from "@/components/cards/bill-cards-list";
import { FinancialSummary } from "@/components/cards/financial-summary";
import { TransactionCardList } from "@/components/cards/transaction-cards-list";

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
