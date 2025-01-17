"use client";

import _ from "lodash";
import React from "react";
import { IoIosAddCircle } from "react-icons/io";
import { Table, HStack, VStack, Heading } from "@chakra-ui/react";

import { LinkButton } from "@/components/ui/link-button";
import { type ClientUser, type ClientBill } from "@/types";
import { LinkedTableRow } from "@/components/app/table-body-row";

namespace BillsTable {
	export interface Props {
		readonly bills: ClientBill[];
		readonly users: ClientUser[];
		readonly balances: Record<string, number>;
	}
}

export const BillsTable: React.FC<BillsTable.Props> = (props) => {
	const { bills, users, balances } = props;

	return (
		<VStack gap="{spacing.4}" alignItems="flex-start">
			<HStack width="100%" justifyContent="space-between">
				<Heading>Bills</Heading>
				<LinkButton variant="solid" href="/bills/new">
					<IoIosAddCircle /> New
				</LinkButton>
			</HStack>
			<Table.Root size="md" interactive variant="outline">
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeader>ID</Table.ColumnHeader>
						<Table.ColumnHeader>Description</Table.ColumnHeader>
						<Table.ColumnHeader>Creator</Table.ColumnHeader>
						<Table.ColumnHeader>Creditor</Table.ColumnHeader>
						<Table.ColumnHeader>Debtors</Table.ColumnHeader>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{bills?.map((item) => (
						<LinkedTableRow key={item.id} href={`/bills/${item.id}`}>
							<Table.Cell>{item.id.slice(0, 6)}</Table.Cell>
							<Table.Cell>{item.description}</Table.Cell>
							<Table.Cell>{item.creator.username}</Table.Cell>
							<Table.Cell>
								{item.bill_members
									.flatMap((billMember) => {
										if (billMember.role === "Creditor") {
											const user = users?.find((user) => user.id === billMember.userId);

											return `${user?.username} (${billMember.amount})`;
										}

										return [];
									})
									.join(", ")}
							</Table.Cell>
							<Table.Cell>
								{_.sortBy(item.bill_members, [(billMember) => billMember.userId])
									.flatMap((billMember) => {
										if (billMember.role === "Creditor") {
											return [];
										}

										const user = users?.find((user) => user.id === billMember.userId);

										return `${user?.username} (${billMember.amount})`;
									})
									.join(", ")}
							</Table.Cell>
						</LinkedTableRow>
					))}
				</Table.Body>
			</Table.Root>
			<Heading>Balances</Heading>
			<Table.Root size="md" variant="outline">
				<Table.Header>
					<Table.Row>
						{Object.keys(balances).map((userId) => (
							<Table.ColumnHeader key={userId}>{users.find((user) => user.id === userId)?.fullName}</Table.ColumnHeader>
						))}
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<Table.Row>
						{Object.entries(balances).map(([id, balance]) => (
							<Table.Cell key={id}>{balance}</Table.Cell>
						))}
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</VStack>
	);
};
