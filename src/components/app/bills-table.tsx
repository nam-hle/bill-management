"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Table, HStack, VStack } from "@chakra-ui/react";

import { Select } from "@/components/app/select";
import { type ClientUser, type ClientBill } from "@/types";

export const BillsTable: React.FC<{
  selectedUserId?: string;
  bills: ClientBill[];
  users: ClientUser[];
}> = ({ bills, users, selectedUserId }) => {
  const router = useRouter();

  const onValueChange = React.useCallback(
    (userId: string | null) => {
      const params = new URLSearchParams(window.location.search);
      if (userId) {
        params.set("userId", userId);
      } else {
        params.delete("filter");
      }
      router.push(`?${params.toString()}`);
    },
    [router],
  );
  console.log(selectedUserId);
  return (
    <VStack gap="{spacing.4}" alignItems="flex-end">
      <HStack width="100%" justifyContent="space-between">
        <Select
          width="30%"
          onValueChange={onValueChange}
          value={users.find((user) => user.id === selectedUserId)?.id}
          items={users.map((user) => ({
            label: user.username,
            value: user.id,
          }))}
        />
        <Link href="/bills/new">New</Link>
      </HStack>
      <Table.Root size="md">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Description</Table.ColumnHeader>
            <Table.ColumnHeader>Creditor</Table.ColumnHeader>
            <Table.ColumnHeader>Amount</Table.ColumnHeader>
            <Table.ColumnHeader>Debtors</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {bills?.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.id.slice(0, 6)}</Table.Cell>
              <Table.Cell>{item.description}</Table.Cell>
              <Table.Cell>{item.creditor.username}</Table.Cell>
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
    </VStack>
  );
};
