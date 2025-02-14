import React from "react";
import type { Metadata } from "next";

import { BillForm } from "@/components/bill-form";

export const metadata: Metadata = {
	title: "New Bill"
};

export default async function NewBillPage() {
	return <BillForm kind={{ type: "create" }} />;
}
