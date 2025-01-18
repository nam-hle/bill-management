import React from "react";
import { Table, VStack, Heading } from "@chakra-ui/react";

import { type BillMemberRole } from "@/types";
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
	const userBillsData = (await BillsControllers.getBillsByMemberId(supabase, { memberId: userId, creditorId: undefined, debtorId: undefined })).map(
		(bill) => {
			return {
				...bill,
				bill_members: bill.bill_members.filter((member) => member.user.id === userId)
			};
		}
	);

	const total = (userBillsData ?? []).reduce(
		(acc, item) => {
			const balances = calculateMoney(item.bill_members);
			acc.net += balances.net;
			acc.paid += balances.paid ?? 0;
			acc.owed += balances.owed ?? 0;

			return acc;
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
					{userBillsData
						?.filter((e) => e.bill_members.length > 0)
						.map((item) => {
							const balances = calculateMoney(item.bill_members);

							return (
								<LinkedTableRow key={item.id} href={`/bills/${item.id}`}>
									<Table.Cell>{item.id.slice(0, 6)}</Table.Cell>
									<Table.Cell>{item.description}</Table.Cell>
									<Table.Cell>{balances.paid}</Table.Cell>
									<Table.Cell>{balances.owed}</Table.Cell>
									<Table.Cell>{balances.net}</Table.Cell>
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

interface BillBalance {
	readonly net: number;
	readonly paid?: number;
	readonly owed?: number;
}

function calculateMoney(
	members: {
		amount: number;
		role: BillMemberRole;
	}[]
): BillBalance {
	if (members.length === 0) {
		return { net: 0 };
	}

	if (members.length === 1) {
		if (members[0].role === "Creditor") {
			return { net: members[0].amount, paid: members[0].amount };
		}

		if (members[0].role === "Debtor") {
			return { net: -members[0].amount, owed: members[0].amount };
		}

		throw new Error("Invalid role");
	}

	if (members.length === 2) {
		const creditor = members.find((m) => m.role === "Creditor");
		const debtor = members.find((m) => m.role === "Debtor");

		if (!creditor || !debtor) {
			throw new Error("Invalid roles");
		}

		return {
			net: creditor.amount - debtor.amount,
			paid: creditor.amount,
			owed: debtor.amount
		};
	}

	throw new Error(`Invalid number of members. Got: ${members.length}`);
}
