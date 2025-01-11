import React from "react";
import { Table, VStack, Heading } from "@chakra-ui/react";

import { createClient } from "@/supabase/server";

type Props = {
  params: { id: string };
};

export default async function UserPage({ params }: Props) {
  const userId = (await params).id;
  console.log({ userId });
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select(`username`)
    .eq("id", userId)
    .single();

  const { data = [], error } = await supabase
    .from("bills")
    .select(
      `
      id,
      description,
      created_at,
      creator_id,
      bill_members (
        user_id,
        amount,
        member:user_id (
          username
        )
      )
    `,
    )
    .eq(`bill_members.user_id`, userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw "Error fetching bills:" + error;
  }
  if (userError) {
    throw "Error fetching bills:" + error;
  }

  // return <pre>{JSON.stringify(data, null, 2)}</pre>;

  return (
    <VStack gap="{spacing.4}" alignItems="flex-start">
      <Heading>User Bills Info</Heading>
      <Table.Root size="md">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Description</Table.ColumnHeader>
            <Table.ColumnHeader>Amount</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data
            ?.filter((e) => e.bill_members.length > 0)
            .map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.id.slice(0, 6)}</Table.Cell>
                <Table.Cell>{item.description}</Table.Cell>
                <Table.Cell>{item.bill_members[0]?.amount}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    </VStack>
  );
}
