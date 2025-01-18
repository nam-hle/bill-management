import _ from "lodash";
import React from "react";

import { createClient } from "@/supabase/server";
import { BillForm } from "@/components/app/bill-form";
import { FormKind, type ClientBillMember } from "@/types";
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
	const { bill_members: billMembers, ...bill } = await BillsControllers.getBillById(supabase, billId);

	const creditor = billMembers.find((member) => member.role === "Creditor");

	if (!creditor) {
		throw "Creditor not found";
	}

	const debtors = _.orderBy(billMembers, (member) => member.userId).filter((member) => member.role === "Debtor");

	return (
		<BillForm
			users={users}
			formState={{ ...bill, creditor: toMemberFormState(creditor), debtors: debtors.map(toMemberFormState), kind: FormKind.UPDATE, editing: false }}
		/>
	);
}

function toMemberFormState(member: ClientBillMember) {
	return {
		userId: member.userId,
		amount: member.amount
	};
}
