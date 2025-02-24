import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { type Metadata } from "next";

import { Button } from "@/components/shadcn/button";

import { BillsTable } from "@/components/tables";

import { getCurrentUser } from "@/services/supabase/server";

export const metadata: Metadata = {
	title: "Bills"
};

export default async function BillsPage() {
	const currentUser = await getCurrentUser();

	return (
		<BillsTable
			currentUserId={currentUser.id}
			action={
				<Button asChild size="sm">
					<Link href="/bills/new">
						<Plus /> New
					</Link>
				</Button>
			}
		/>
	);
}
