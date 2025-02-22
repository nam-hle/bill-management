"use client";

import React from "react";
import { FaCheck } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/shadcn/badge";
import { TypographyH1 } from "@/components/typography";
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

	const { data, isLoading } = useQuery({
		queryKey: ["bank-accounts", currentUserId],
		queryFn: () => API.BankAccounts.List.query({ userId: currentUserId })
	});

	return (
		<div className="mx-auto flex w-[60%] flex-col gap-4">
			<div className="w-full">
				<TypographyH1>Accounts</TypographyH1>
			</div>

			<DataTable
				data={data ?? []}
				columns={[
					{
						key: "provider",
						label: "Provider",
						dataGetter: ({ row }) => row.providerName
					},
					{
						key: "accountNumber",
						label: "Account number",
						dataGetter: ({ row }) => row.accountNumber
					},
					{
						key: "accountHolder",
						label: "Account holder",
						dataGetter: ({ row }) => row.accountHolder
					},
					{
						key: "status",
						label: "Status",
						dataGetter: ({ row }) => {
							return row.status === BankAccountStatusEnumSchema.enum.Active ? (
								<Badge>{BankAccountStatusEnumSchema.enum.Active}</Badge>
							) : (
								<Badge>{BankAccountStatusEnumSchema.enum.Inactive}</Badge>
							);
						}
					},
					{
						key: "default",
						label: "Default",
						dataGetter: ({ row }) => (row.isDefault ? <FaCheck /> : null)
					}
				]}
			/>
		</div>
	);
};
