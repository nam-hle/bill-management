import React from "react";
import { IoIosAddCircle } from "react-icons/io";
import { Table, VStack } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

import { createClient } from "@/supabase/server";
import { LinkButton } from "@/components/ui/link-button";

export default async function UsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase.from("users").select();

  return (
    <VStack gap="{spacing.4}" alignItems="flex-end">
      <LinkButton href="/users/new">
        <IoIosAddCircle /> New
      </LinkButton>
      <Table.Root size="md">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Username</Table.ColumnHeader>
            <Table.ColumnHeader>Created At</Table.ColumnHeader>
            <Table.ColumnHeader></Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users?.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.id.slice(0, 6)}</Table.Cell>
              <Table.Cell>{item.username}</Table.Cell>
              <Table.Cell>
                {item.created_at
                  ? formatDistanceToNow(new Date(item.created_at), {
                      addSuffix: true,
                    })
                  : ""}
              </Table.Cell>
              <Table.Cell display="flex" justifyContent="flex-end">
                <LinkButton variant="outline" href={`/users/${item.id}`}>
                  Profile
                </LinkButton>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </VStack>
  );
}
