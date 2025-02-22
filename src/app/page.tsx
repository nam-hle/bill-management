import React from "react";

import { BillCardsList } from "@/components/bill-cards-list";
import { FinancialSummary } from "@/components/financial-summary";
import { TransactionCardList } from "@/components/transaction-cards-list";

import { getCurrentUser } from "@/services/supabase/server";

export default async function DashboardPage() {
	const currentUser = await getCurrentUser();

	return (
		<>
			<div className="flex flex-col gap-6">
				<FinancialSummary />
				<div className="flex flex-col gap-8 lg:flex-row">
					<div className="flex-1 space-y-4">
						<BillCardsList currentUserId={currentUser.id} />
					</div>
					<div className="flex-1 space-y-4">
						<TransactionCardList currentUserId={currentUser.id} />
					</div>
				</div>
			</div>
		</>
	);
}
