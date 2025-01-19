import React from "react";
import { Table, VStack, Heading } from "@chakra-ui/react";

import { calculateMoney } from "@/utils";
import { createClient } from "@/supabase/server";
import { LinkedTableRow } from "@/components/app/table-body-row";
import { UsersControllers } from "@/controllers/users.controllers";
import { BillsControllers } from "@/controllers/bills.controllers";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function UserPage({ params }: Props) {
	const userId = (await params).id;
	const supabase = await createClient();

	const userInfo = await UsersControllers.getUserById(supabase, userId);
	const userBillsData = await BillsControllers.getBillsByMemberId(supabase, { memberId: userId });

	const total = (userBillsData ?? []).reduce(
		(result, bill) => {
			const balances = calculateMoney(bill, userId);
			result.net += balances.net;
			result.paid += balances.paid ?? 0;
			result.owed += balances.owed ?? 0;

			return result;
		},
		{ net: 0, paid: 0, owed: 0 }
	);

	return (
		<VStack gap="{spacing.4}" alignItems="flex-start">
			<Heading>{userInfo.fullName}</Heading>
			<Heading size="md">Bills</Heading>
			<Table.Root size="md" interactive variant="outline">
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeader>ID</Table.ColumnHeader>
						<Table.ColumnHeader>Description</Table.ColumnHeader>
						<Table.ColumnHeader>Paid</Table.ColumnHeader>
						<Table.ColumnHeader>Owe</Table.ColumnHeader>
						<Table.ColumnHeader>Net Balance</Table.ColumnHeader>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{userBillsData.map((bill) => {
						const { paid, owed, net } = calculateMoney(bill, userId);

						return (
							<LinkedTableRow key={bill.id} href={`/bills/${bill.id}`}>
								<Table.Cell>{bill.id.slice(0, 6)}</Table.Cell>
								<Table.Cell>{bill.description}</Table.Cell>
								<Table.Cell>{paid}</Table.Cell>
								<Table.Cell>{owed}</Table.Cell>
								<Table.Cell>{net}</Table.Cell>
							</LinkedTableRow>
						);
					})}
				</Table.Body>
				<Table.Footer>
					<Table.Row>
						<Table.Cell></Table.Cell>
						<Table.Cell>Total:</Table.Cell>
						<Table.Cell>{total.paid}</Table.Cell>
						<Table.Cell>{total.owed}</Table.Cell>
						<Table.Cell>{total.net}</Table.Cell>
					</Table.Row>
				</Table.Footer>
			</Table.Root>
		</VStack>
	);
}
