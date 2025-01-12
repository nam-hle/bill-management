import React from "react";

import { type ClientBill } from "@/types";
import { createClient } from "@/supabase/server";
import { BillsTable } from "@/components/app/bills-table";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BillsPage(props: Props) {
  const userId = (await props.searchParams).userId;

  if (Array.isArray(userId)) {
    throw new Error("Expected a single userId");
  }

  const supabase = await createClient();
  const { data: users } = await supabase.from("users").select();
  const bills = await getBillsByUserId(userId);

  const { data: membersData, error: membersError } = await supabase
    .from("bill_members")
    .select("user_id, role, amount, users (username)");

  if (membersError) {
    throw new Error(`Error fetching bill members`);
  }

  const balances = membersData.reduce(
    (acc, member) => {
      const balanceChange =
        member.role === "Creditor" ? member.amount : -member.amount;
      acc[member.users.username] =
        (acc[member.users.username] || 0) + balanceChange;

      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <BillsTable
      balances={balances}
      bills={bills ?? []}
      users={users ?? []}
      selectedUserId={userId}
    />
  );
}

async function getBillsByUserId(
  userId: string | undefined,
): Promise<ClientBill[]> {
  if (userId) {
    return getBillsByBillMember(userId);
  }

  const supabase = await createClient();

  const { data: bills } = await supabase.from("bills").select(`
    id,
    description,
    creator:creator_id (
      username
    ),
    bill_members (id, user_id, amount, role)
  `);

  return bills ?? [];
}

async function getBillsByBillMember(
  billMemberUserId: string,
): Promise<ClientBill[]> {
  const supabase = await createClient();
  const { data: targetBillIds } = await supabase
    .from("bill_members")
    .select("bill_id")
    .eq("user_id", billMemberUserId);

  if (!targetBillIds?.length) {
    return [];
  }

  const { data, error } = await supabase
    .from("bills")
    .select(
      `
    id,
    description,
    creator:creator_id (
      username
    ),
    bill_members (id, user_id, amount, role)
  `,
    )
    .in(
      "id",
      targetBillIds.map((e) => e.bill_id),
    );

  if (error) {
    throw error;
  }

  return data ?? [];
}
