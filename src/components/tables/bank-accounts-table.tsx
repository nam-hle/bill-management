"use client";

import React from "react";
import { Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/shadcn/badge";

import { DataTable } from "@/components/data-table/data-table";

import { API } from "@/api";
import { BankAccountStatusEnumSchema } from "@/schemas";

namespace BankAccountsTable {
	export interface Props {
		readonly currentUserId: string;
	}
}

export const BankAccountsTable: React.FC<BankAccountsTable.Props> = (props) => {
	const { currentUserId } = props;

	const { data } = useQuery({
		queryKey: ["bank-accounts", currentUserId],
		queryFn: () => API.BankAccounts.List.query({ userId: currentUserId })
	});

	return (
		<div className="mx-auto mt-6 flex w-[60%] flex-col gap-4">
			<DataTable
				data={data}
				title="Bank Accounts"
				columns={[
					{ key: "provider", label: "Provider", dataGetter: ({ row }) => row.providerName },
					{ key: "accountNumber", label: "Account number", dataGetter: ({ row }) => row.accountNumber },
					{ key: "accountHolder", label: "Account holder", dataGetter: ({ row }) => row.accountHolder },
					{
						key: "status",
						label: "Status",
						dataGetter: ({ row }) =>
							row.status === BankAccountStatusEnumSchema.enum.Active ? (
								<Badge>{BankAccountStatusEnumSchema.enum.Active}</Badge>
							) : (
								<Badge>{BankAccountStatusEnumSchema.enum.Inactive}</Badge>
							)
					},
					{ key: "default", label: "Default", dataGetter: ({ row }) => (row.isDefault ? <Check /> : null) }
				]}
			/>
		</div>
	);
};
