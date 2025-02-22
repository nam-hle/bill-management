"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";

import { StatText } from "@/components/stat-text";

import { type Balance } from "@/types";
import { axiosInstance } from "@/services";

export function BalanceReport() {
	const { data } = useQuery<{ data: Balance }>({
		queryKey: ["balance-report"],
		queryFn: () => axiosInstance.get("/profile/balance")
	});

	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-bold">Balance</h1>
			<div className="grid grid-cols-5 gap-4">
				<StatText label="Owed" value={data?.data?.owed} info="The total amount you need to pay back to others" />
				<StatText label="Received" value={data?.data?.received} info="The total amount you have received by transactions by others" />
				<StatText label="Paid" value={data?.data?.paid} info="The total amount you have paid on behalf of others" />
				<StatText label="Sent" value={data?.data?.sent} info="The total amount you sent by transactions to others" />
				<StatText info="asd" label="Net Balance" value={data?.data?.net} />
			</div>
		</div>
	);
}
