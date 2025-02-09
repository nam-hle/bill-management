import React from "react";
import type { Metadata } from "next";

import { TransactionForm } from "@/components/transaction-form";
import { UsersControllers } from "@/controllers/users.controllers";
import { getCurrentUser, createSupabaseServer } from "@/services/supabase/server";

export const metadata: Metadata = {
	title: "New Transaction"
};

export default async function NewTransactionPage() {
	const supabase = await createSupabaseServer();
	const users = await UsersControllers.getUsers(supabase);
	const currentUser = await getCurrentUser();

	return <TransactionForm users={users} kind={{ type: "create" }} currentUserId={currentUser.id} />;
}
