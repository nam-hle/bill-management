import { Table } from "@chakra-ui/react";
import { createClient } from "@/supabase/server";

export default async function UsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase.from("users").select();

  return (
    <Table.Root size="md">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>ID</Table.ColumnHeader>
          <Table.ColumnHeader>Description</Table.ColumnHeader>
          <Table.ColumnHeader>Amount</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {users?.map((item) => (
          <Table.Row key={item.id}>
            <Table.Cell>{item.id.slice(0, 6)}</Table.Cell>
            <Table.Cell>{item.username}</Table.Cell>
            <Table.Cell>{item.created_at}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
