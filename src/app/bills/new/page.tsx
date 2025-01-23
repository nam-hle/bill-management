import React from "react";
import type { Metadata } from "next";

import { FormKind } from "@/types";
import { createClient } from "@/supabase/server";
import { BillForm } from "@/components/app/bill-form";
import { UsersControllers } from "@/controllers/users.controllers";

export const metadata: Metadata = {
	title: "New Bill"
};

export default async function NewBillPage() {
	const supabase = await createClient();
	const users = await UsersControllers.getUsers(supabase);

	return (
		<BillForm
			metadata={{}}
			users={users}
			kind={FormKind.CREATE}
			formState={{
				creditor: {},
				issuedAt: null,
				description: "",
				debtors: [{ userId: undefined, amount: undefined }]
			}}
		/>
	);
}
