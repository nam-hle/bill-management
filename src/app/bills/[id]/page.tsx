import React from "react";

import { FormKind } from "@/types";
import { createClient } from "@/supabase/server";
import { BillForm } from "@/components/app/bill-form";
import { UsersControllers } from "@/controllers/users.controllers";
import { BillsControllers } from "@/controllers/bills.controllers";

namespace BillDetailsPage {
	export interface Props {
		params: Promise<{ id: string }>;
	}
}

export default async function BillDetailsPage(props: BillDetailsPage.Props) {
	const billId = (await props.params).id;
	const supabase = await createClient();
	const users = await UsersControllers.getUsers(supabase);
	const bill = await BillsControllers.getBillById(supabase, billId);

	return <BillForm users={users} formState={{ ...bill, kind: FormKind.UPDATE, editing: false }} />;
}
