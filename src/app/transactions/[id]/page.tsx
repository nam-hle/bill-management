import React from "react";
import type { Metadata } from "next";

import { createSupabaseServer } from "@/services";
import { TransactionForm } from "@/components/transaction-form";
import { UsersControllers, TransactionsControllers } from "@/controllers";

export const metadata: Metadata = {
	title: "Transaction Details"
};

namespace TransactionDetailsPage {
	export interface Props {
		params: Promise<{ id: string }>;
	}
}

export default async function TransactionDetailsPage(props: TransactionDetailsPage.Props) {
	const transactionId = (await props.params).id;
	const supabase = await createSupabaseServer();
	const users = await UsersControllers.getUsers(supabase);
	const {
		data: { user: currentUser }
	} = await supabase.auth.getUser();

	if (!currentUser) {
		throw new Error("User not found");
	}

	const transaction = await TransactionsControllers.getById(supabase, transactionId);

	return <TransactionForm users={users} currentUserId={currentUser.id} kind={{ transaction, type: "update" }} />;
}
