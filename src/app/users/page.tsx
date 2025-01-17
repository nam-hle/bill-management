import React from "react";
import { IoMdAdd } from "react-icons/io";
import { Table, VStack, HStack, Heading } from "@chakra-ui/react";

import { createClient } from "@/supabase/server";
import { LinkButton } from "@/components/ui/link-button";
import { LinkedTableRow } from "@/components/app/table-body-row";
import { UsersControllers } from "@/controllers/users.controllers";

export default async function UsersPage() {
	const supabase = await createClient();

	const users = await UsersControllers.getUsers(supabase);

	return (
		<VStack>
			<HStack width="100%" justifyContent="space-between">
				<Heading>Users</Heading>
				<LinkButton variant="solid" href="/users/new">
					<IoMdAdd /> New
				</LinkButton>
			</HStack>
			<Table.Root size="md" interactive variant="outline">
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeader>ID</Table.ColumnHeader>
						<Table.ColumnHeader>Username</Table.ColumnHeader>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{users?.map((item) => (
						<LinkedTableRow key={item.id} href={`/users/${item.id}`}>
							<Table.Cell>{item.id.slice(0, 6)}</Table.Cell>
							<Table.Cell>{item.username}</Table.Cell>
						</LinkedTableRow>
					))}
				</Table.Body>
			</Table.Root>
		</VStack>
	);
}
