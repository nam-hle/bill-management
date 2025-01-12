import React from "react";

import { createClient } from "@/supabase/server";
import { BillForm } from "@/components/app/bill-form";
import { UsersControllers } from "@/controllers/users.controllers";
import { BillsControllers } from "@/controllers/bills.controllers";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function BillDetailsPage(props: Props) {
	const billId = (await props.params).id;
	const supabase = await createClient();
	const users = await UsersControllers.getUsers(supabase);
	const bill = await BillsControllers.getBillById(supabase, billId);

	const creditor = bill.bill_members.find((member) => member.role === "Creditor");

	if (!creditor) {
		throw "Creditor not found";
	}

	const debtors = bill.bill_members.filter((member) => member.role === "Debtor");

	return <BillForm users={users} formState={{ ...bill, creditor, debtors }} />;
}
