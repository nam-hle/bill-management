import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { type Metadata } from "next";

import { Button } from "@/components/shadcn/button";
import { TransactionsTable } from "@/components/tables";

import { getCurrentUser } from "@/services/supabase/server";

export const metadata: Metadata = {
	title: "Transactions"
};

export default async function TransactionsPage() {
	const currentUser = await getCurrentUser();

	return (
		<div className="flex flex-col items-start gap-4">
			<TransactionsTable
				mode="advance"
				currentUserId={currentUser.id}
				action={
					<Button asChild size="sm">
						<Link href="/transactions/new">
							<Plus /> New
						</Link>
					</Button>
				}
			/>
		</div>
	);
}
