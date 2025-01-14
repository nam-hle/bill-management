"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Table, HStack, VStack, Heading } from "@chakra-ui/react";
import { IoIosAddCircle, IoIosArrowRoundForward } from "react-icons/io";

import { Select } from "@/components/app/select";
import { LinkButton } from "@/components/ui/link-button";
import { type ClientUser, type ClientBill } from "@/types";

namespace BillsTable {
	export interface Props {
		readonly bills: ClientBill[];
		readonly users: ClientUser[];
		readonly selectedUserId?: string;
		readonly balances: Record<string, number>;
	}
}

export const BillsTable: React.FC<BillsTable.Props> = (props) => {
	const { bills, users, selectedUserId, balances } = props;
	const router = useRouter();

	const onValueChange = React.useCallback(
		(userId: string | null) => {
			const params = new URLSearchParams(window.location.search);

			if (userId) {
				params.set("userId", userId);
			} else {
				params.delete("filter");
			}

			router.push(`?${params.toString()}`);
		},
		[router]
	);

	return (
		<VStack gap="{spacing.4}" alignItems="flex-start">
			<HStack width="100%" justifyContent="space-between">
				<Select
					width="30%"
					onValueChange={onValueChange}
					value={users.find((user) => user.id === selectedUserId)?.id}
					items={users.map((user) => ({
						label: user.username,
						value: user.id
					}))}
				/>
				<LinkButton href="/bills/new">
					<IoIosAddCircle /> New
				</LinkButton>
			</HStack>
			<Heading>Balances</Heading>
			<Table.Root size="md">
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
			<Heading>Bills</Heading>
			<Table.Root size="md">
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeader>ID</Table.ColumnHeader>
						<Table.ColumnHeader>Description</Table.ColumnHeader>
						<Table.ColumnHeader>Creator</Table.ColumnHeader>
						<Table.ColumnHeader>Creditor</Table.ColumnHeader>
						<Table.ColumnHeader>Debtors</Table.ColumnHeader>
						<Table.ColumnHeader></Table.ColumnHeader>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{bills?.map((item) => (
						<Table.Row key={item.id}>
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
								{item.bill_members
									.flatMap((billMember) => {
										if (billMember.role === "Creditor") {
											return [];
										}

										const user = users?.find((user) => user.id === billMember.userId);

										return `${user?.username} (${billMember.amount})`;
									})
									.join(", ")}
							</Table.Cell>
							<Table.Cell display="flex" justifyContent="flex-end">
								<LinkButton variant="outline" href={`/bills/${item.id}`}>
									<IoIosArrowRoundForward />
								</LinkButton>
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
		</VStack>
	);
};
