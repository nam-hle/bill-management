import React from "react";
import type { Metadata } from "next";

import { FormKind } from "@/types";
import { formatDate } from "@/utils";
import { createClient } from "@/supabase/server";
import { BillForm } from "@/components/app/bill-form";
import { UsersControllers } from "@/controllers/users.controllers";
import { BillsControllers } from "@/controllers/bills.controllers";

export const metadata: Metadata = {
	title: "Bill Details"
};

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

	return <BillForm users={users} billId={billId} kind={FormKind.UPDATE} formState={{ ...bill, issuedAt: formatDate(bill.issuedAt) }} />;
}
