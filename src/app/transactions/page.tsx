import React from "react";
import { type Metadata } from "next";

import { TransactionsTable } from "@/components/tables";

import { getCurrentUser } from "@/services/supabase/server";

export const metadata: Metadata = {
	title: "Transactions"
};

export default async function TransactionsPage() {
	const currentUser = await getCurrentUser();

	return <TransactionsTable currentUserId={currentUser.id} />;
}
