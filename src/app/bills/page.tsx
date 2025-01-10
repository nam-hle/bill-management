import { Table } from "@chakra-ui/react";
import { createClient } from "@/supabase/server";

export default async function BillsPage() {
  const supabase = await createClient();
  const { data: users } = await supabase.from("users").select();

  const { data: bills } = await supabase.from("bills").select(`
    id,
    description,
    total_amount,
    bill_members (id, user_id, amount)
  `);

  return (
    <Table.Root size="md">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>ID</Table.ColumnHeader>
          <Table.ColumnHeader>Description</Table.ColumnHeader>
          <Table.ColumnHeader>Amount</Table.ColumnHeader>
          <Table.ColumnHeader>Members</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {bills?.map((item) => (
          <Table.Row key={item.id}>
            <Table.Cell>{item.id.slice(0, 6)}</Table.Cell>
            <Table.Cell>{item.description}</Table.Cell>
            <Table.Cell>{item.total_amount}</Table.Cell>
            <Table.Cell>
              {item.bill_members
                .map((billMember) => {
                  const user = users?.find(
                    (user) => user.id === billMember.user_id,
                  );
                  return `${user?.username} (${billMember.amount})`;
                })
                .join(", ")}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
