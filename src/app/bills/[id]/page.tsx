import _ from "lodash";
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

	const creditor = bill.bill_members.find((member) => member.role === "Creditor");

	if (!creditor) {
		throw "Creditor not found";
	}

	const debtors = _.orderBy(bill.bill_members, (member) => member.user.id).filter((member) => member.role === "Debtor");

	return <BillForm users={users} formState={{ ...bill, creditor, debtors, kind: FormKind.UPDATE, editing: false }} />;
}
