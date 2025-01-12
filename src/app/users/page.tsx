import React from "react";
import Link from "next/link";
import { Table, VStack } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

import { createClient } from "@/supabase/server";

export default async function UsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase.from("users").select();

  return (
    <VStack gap="{spacing.4}" alignItems="flex-end">
      <Link href="/users/new">New</Link>
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
              <Table.Cell>
                <Link href={`/users/${item.id}`}>Profile</Link>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </VStack>
  );
}
