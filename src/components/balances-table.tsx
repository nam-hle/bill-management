import React from "react";
import { Table, Heading } from "@chakra-ui/react";

import { type ClientUser } from "@/schemas";

namespace BalancesTable {
	export interface Props {
		readonly users: ClientUser[];
		readonly balances: Record<string, number>;
	}
}

export const BalancesTable: React.FC<BalancesTable.Props> = (props) => {
	const { users, balances } = props;

	return (
		<>
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
		</>
	);
};
