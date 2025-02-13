import React from "react";
import type { Metadata } from "next";

import { FormKind } from "@/types";
import { UsersControllers } from "@/controllers";
import { BillForm } from "@/components/bill-form";
import { createSupabaseServer } from "@/services/supabase/server";

export const metadata: Metadata = {
	title: "New Bill"
};

export default async function NewBillPage() {
	const supabase = await createSupabaseServer();
	const users = await UsersControllers.getUsers(supabase);

	return (
		<BillForm
			metadata={{}}
			users={users}
			kind={FormKind.CREATE}
			newKind={{ type: "create" }}
			formState={{
				creditor: {},
				issuedAt: null,
				description: "",
				receiptFile: null,
				debtors: [{ userId: undefined, amount: undefined }]
			}}
		/>
	);
}
