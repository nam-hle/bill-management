"use client";

import React from "react";
import Link from "next/link";
import { Plus, Check } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";

import { DataTable } from "@/components/data-table/data-table";

import { trpc } from "@/services";
import { BankAccountStatusEnumSchema } from "@/schemas";

namespace BankAccountsTable {
	export interface Props {
		readonly currentUserId: string;
	}
}

export const BankAccountsTable: React.FC<BankAccountsTable.Props> = (props) => {
	const { currentUserId } = props;

	const { data } = trpc.profile.getBankAccounts.useQuery({ userId: currentUserId });

	return (
		<div className="mx-auto mt-6 flex w-[60%] flex-col gap-4">
			<DataTable
				data={data}
				title="Bank Accounts"
				action={
					<Button asChild size="sm">
						<Link href="/profile/banks/new">
							<Plus /> New
						</Link>
					</Button>
				}
				columns={[
					// { key: "provider", label: "Provider", dataGetter: ({ row }) => row.providerName },
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
