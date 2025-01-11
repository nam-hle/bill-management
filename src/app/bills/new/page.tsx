import React from "react";

import { createClient } from "@/supabase/server";
import { BillForm } from "@/components/app/bill-form";

export default async function NewBillPage() {
  const supabase = await createClient();
  const { data: users } = await supabase.from("users").select();

  return <BillForm users={users ?? []} />;
}
