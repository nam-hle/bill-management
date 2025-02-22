import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { TransactionsTable } from "@/components/tables";
import { BalanceReport } from "@/components/balance-report";
import { CompactRecentBillsWithAvatars } from "@/components/compact-bill";

import { getCurrentUser } from "@/services/supabase/server";

export default async function DashboardPage() {
	const currentUser = await getCurrentUser();

	return (
		<>
			<div className="flex flex-col gap-6">
				<BalanceReport />
				<CompactRecentBillsWithAvatars currentUserId={currentUser.id} />
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
