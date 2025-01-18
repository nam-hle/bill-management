import React from "react";

import { FormKind } from "@/types";
import { createClient } from "@/supabase/server";
import { BillForm } from "@/components/app/bill-form";
import { UsersControllers } from "@/controllers/users.controllers";

export default async function NewBillPage() {
	const supabase = await createClient();
	const users = await UsersControllers.getUsers(supabase);

	return (
		<BillForm users={users} formState={{ kind: FormKind.CREATE, createdAt: null, updatedAt: null, editing: true, description: "", debtors: [] }} />
	);
}
