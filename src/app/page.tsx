import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { TransactionsTable } from "@/components/tables";
import { BillCardsList } from "@/components/bill-cards-list";
import { FinancialSummary } from "@/components/financial-summary";

import { getCurrentUser } from "@/services/supabase/server";

export default async function DashboardPage() {
	const currentUser = await getCurrentUser();

	return (
		<>
			<div className="flex flex-col gap-6">
				<FinancialSummary />
				<BillCardsList currentUserId={currentUser.id} />
				<TransactionsTable
					mode="basic"
					title="Recent transactions"
					currentUserId={currentUser.id}
					action={
						<Button asChild size="sm">
							<Link href="/transactions">
								View All <ArrowRight />
							</Link>
						</Button>
					}
				/>
			</div>
		</>
	);
}
