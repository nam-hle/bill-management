"use client";

import React from "react";
import { FaCheck } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { Table, Badge, HStack, VStack, Heading } from "@chakra-ui/react";

import { API } from "@/api";
import { EmptyState } from "@/chakra/empty-state";
import { BankAccountStatusEnumSchema } from "@/schemas";
import { TableBodySkeleton } from "@/components/table-body-skeleton";

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
		<VStack width="60%" className="ck" gap="{spacing.4}" marginInline="auto">
			<HStack width="100%" justifyContent="space-between">
				<Heading as="h1">Accounts</Heading>
			</HStack>

			{/*{transactions.length === 0 && <EmptyState width="100%" title="You have no transactions yet." />}*/}

			<Table.Root size="md" interactive variant="outline">
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeader>Provider</Table.ColumnHeader>
						<Table.ColumnHeader>Account number</Table.ColumnHeader>
						<Table.ColumnHeader>Account holder</Table.ColumnHeader>
						<Table.ColumnHeader>Status</Table.ColumnHeader>
						<Table.ColumnHeader>Default</Table.ColumnHeader>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{isLoading ? (
						<TableBodySkeleton numberOfCols={5} />
					) : !data?.length ? (
						<Table.Row width="100%">
							<Table.Cell colSpan={5}>
								<EmptyState title="You have no transactions yet." />
							</Table.Cell>
						</Table.Row>
					) : (
						data.map((account) => (
							<Table.Row key={account.id}>
								<Table.Cell>{account.providerName}</Table.Cell>
								<Table.Cell>{account.accountNumber}</Table.Cell>
								<Table.Cell>{account.accountHolder}</Table.Cell>
								<Table.Cell>
									{account.status === BankAccountStatusEnumSchema.enum.Active ? (
										<Badge colorPalette="green">{BankAccountStatusEnumSchema.enum.Active}</Badge>
									) : (
										<Badge>{BankAccountStatusEnumSchema.enum.Inactive}</Badge>
									)}
								</Table.Cell>
								<Table.Cell>{account.isDefault ? <FaCheck /> : null}</Table.Cell>
							</Table.Row>
						))
					)}
				</Table.Body>
			</Table.Root>
		</VStack>
	);
};
