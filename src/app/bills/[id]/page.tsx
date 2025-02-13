import React from "react";
import type { Metadata } from "next";

import { FormKind } from "@/types";
import { BillForm } from "@/components/bill-form";
import { createSupabaseServer } from "@/services/supabase/server";
import { UsersControllers, BillsControllers } from "@/controllers";

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
	const supabase = await createSupabaseServer();
	const users = await UsersControllers.getUsers(supabase);
	const { updater, creator, ...bill } = await BillsControllers.getById(supabase, billId);

	return <BillForm users={users} formState={bill} kind={FormKind.UPDATE} metadata={{ creator, id: billId, updater: updater }} />;
}
