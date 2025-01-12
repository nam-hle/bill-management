import React from "react";

import { createClient } from "@/supabase/server";
import { BillForm } from "@/components/app/bill-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BillDetailsPage(props: Props) {
  const billId = (await props.params).id;
  const supabase = await createClient();
  const { data: users } = await supabase.from("users").select();

  const { data: bills } = await supabase
    .from("bills")
    .select(
      `
    id,
    description,
    creator:creatorId (
      username
    ),
    bill_members (id, userId, amount, role)
    
  `,
    )
    .eq("id", billId);

  if (bills?.length !== 1) {
    throw "Bill not found";
  }

  const bill = bills[0];
  const creditor = bill.bill_members.find(
    (member) => member.role === "Creditor",
  );

  if (!creditor) {
    throw "Creditor not found";
  }

  const debtors = bill.bill_members.filter(
    (member) => member.role === "Debtor",
  );

  return (
    <BillForm users={users ?? []} formState={{ ...bill, creditor, debtors }} />
  );
}
