import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { type Metadata } from "next";

import { BillsTable } from "@/components/tables";
import { Button } from "@/components/shadcn/button";

import { getCurrentUser } from "@/services/supabase/server";

export const metadata: Metadata = {
	title: "Bills"
};

export default async function BillsPage() {
	const currentUser = await getCurrentUser();

	return (
		<div className="flex flex-col items-start gap-4">
			<BillsTable
				advanced
				currentUserId={currentUser.id}
				action={
					<Button asChild size="sm">
						<Link href="/bills/new">
							<Plus /> New
						</Link>
					</Button>
				}
			/>
		</div>
	);
}
