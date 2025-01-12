"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Table, HStack, VStack, Heading } from "@chakra-ui/react";

import { Select } from "@/components/app/select";
import { type ClientUser, type ClientBill } from "@/types";

export const BillsTable: React.FC<{
  selectedUserId?: string;
  balances: Record<string, number>;
  bills: ClientBill[];
  users: ClientUser[];
}> = ({ bills, users, selectedUserId, balances }) => {
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

  return (
    <VStack gap="{spacing.4}" alignItems="flex-start">
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
      <Heading>Balances</Heading>
      <Table.Root size="md">
        <Table.Header>
          <Table.Row>
            {Object.keys(balances).map((username) => (
              <Table.ColumnHeader key={username}>{username}</Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            {Object.entries(balances).map(([id, balance]) => (
              <Table.Cell key={id}>{balance}</Table.Cell>
            ))}
          </Table.Row>
        </Table.Body>
      </Table.Root>
      <Heading>Bills</Heading>
      <Table.Root size="md">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Description</Table.ColumnHeader>
            <Table.ColumnHeader>Creator</Table.ColumnHeader>
            <Table.ColumnHeader>Creditor</Table.ColumnHeader>
            <Table.ColumnHeader>Debtors</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {bills?.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.id.slice(0, 6)}</Table.Cell>
              <Table.Cell>{item.description}</Table.Cell>
              <Table.Cell>{item.creator.username}</Table.Cell>
              <Table.Cell>
                {item.bill_members
                  .flatMap((billMember) => {
                    if (billMember.role === "Creditor") {
                      const user = users?.find(
                        (user) => user.id === billMember.user_id,
                      );

                      return `${user?.username} (${billMember.amount})`;
                    }

                    return [];
                  })
                  .join(", ")}
              </Table.Cell>
              <Table.Cell>
                {item.bill_members
                  .flatMap((billMember) => {
                    if (billMember.role === "Creditor") {
                      return [];
                    }

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
