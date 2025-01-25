import React from "react";
import type { Metadata } from "next";

import { createClient } from "@/supabase/server";
import { UsersControllers } from "@/controllers/users.controllers";
import { TransactionForm } from "@/components/app/transaction-form";

export const metadata: Metadata = {
	title: "New Transaction"
};

export default async function NewTransactionPage() {
	const supabase = await createClient();
	const users = await UsersControllers.getUsers(supabase);
	const {
		data: { user: currentUser }
	} = await supabase.auth.getUser();

	if (!currentUser) {
		throw new Error("User not found");
	}

	return <TransactionForm users={users.filter((user) => user.id !== currentUser.id)} />;
}
