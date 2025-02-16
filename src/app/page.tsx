import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { BalanceReport } from "@/components/balance-report";
import { BillsTable, TransactionsTable } from "@/components/tables";

import { getCurrentUser } from "@/services/supabase/server";

export default async function DashboardPage() {
	const currentUser = await getCurrentUser();

	return (
		<>
			<div className="flex flex-col gap-6">
				<BalanceReport />
				<BillsTable
					title="Recent bills"
					currentUserId={currentUser.id}
					action={
						<Button asChild size="sm">
							<Link href="/bills">
								View All <ArrowRight />
							</Link>
						</Button>
					}
				/>
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
