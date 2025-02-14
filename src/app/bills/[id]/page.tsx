import React from "react";
import type { Metadata } from "next";

import { BillForm } from "@/components/bill-form";

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

	return <BillForm newKind={{ billId, type: "update" }} />;
}
