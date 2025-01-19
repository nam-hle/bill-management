import React from "react";
import { MdArrowRightAlt } from "react-icons/md";
import { Box, Text, HStack, Button, Heading } from "@chakra-ui/react";

import { createClient } from "@/supabase/server";
import { LinkButton } from "@/components/ui/link-button";
import { BillsTable } from "@/components/app/bills-table";
import { UsersControllers } from "@/controllers/users.controllers";
import { BillsControllers } from "@/controllers/bills.controllers";

export default async function DashboardPage() {
	const supabase = await createClient();

	const {
		data: { user: currentUser }
	} = await supabase.auth.getUser();

	if (!currentUser) {
		throw new Error("User not found");
	}

	const balance = await UsersControllers.getBalance(supabase, currentUser.id);
	const bills = await BillsControllers.getBillsByMemberId(supabase, { memberId: currentUser.id });

	return (
		<Box>
			<Heading mb={4} as="h1">
				Dashboard
			</Heading>

			<Box p={6} mb={4} shadow="md" rounded="md" bg="gray.100">
				<Heading mb={4} as="h2" size="md">
					Balance Summary
				</Heading>
				<HStack mb={2} justify="space-between">
					<Text>Total Owed:</Text>
					<Text fontWeight="bold">{balance.owed.toFixed(2)}</Text>
				</HStack>
				<HStack mb={2} justify="space-between">
					<Text>Total To Receive:</Text>
					<Text fontWeight="bold">{balance.paid.toFixed(2)}</Text>
				</HStack>
				<HStack justify="space-between">
					<Text>Net Balance:</Text>
					<Text fontWeight="bold">{balance.net.toFixed(2)}</Text>
				</HStack>
				<Button mt={4} colorScheme="blue">
					View Details
				</Button>
			</Box>

			<BillsTable
				bills={bills}
				title="Recent bills"
				currentUserId={currentUser.id}
				action={
					<LinkButton href="/bills" variant="subtle" colorScheme="blue">
						View All <MdArrowRightAlt />
					</LinkButton>
				}
			/>
		</Box>
	);
}
