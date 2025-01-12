import { type BillFormState } from "@/types";
import { createClient } from "@/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = body as BillFormState;
    const supabase = await createClient();
    if (!payload.creditor || !payload.creditor.amount) {
      throw new Error("Creditor is required");
    }

    const { data: billData, error: billError } = await supabase
      .from("bills")
      .insert({
        description: payload.description,
        creator_id: payload.creditor.userId,
      })
      .select("id")
      .single();

    if (billError) {
      throw new Error(`Error inserting bill: ${billError.message}`);
    }

    const billId = billData.id;

    // Step 2: Insert bill members
    const billMembers = payload.debtors.map((debtor) => {
      if (!debtor.userId || !debtor.amount) {
        throw new Error("Debtor is missing userId or amount");
      }
      return {
        bill_id: billId,
        user_id: debtor.userId,
        amount: debtor.amount,
      };
    });

    const { data: membersData, error: membersError } = await supabase
      .from("bill_members")
      .insert(billMembers);

    if (membersError) {
      throw new Error(`Error inserting bill: ${membersError.message}`);
    }

    console.log("Bill and members successfully inserted:", {
      bill: billData,
      members: membersData,
    });

    return new Response(
      JSON.stringify({ success: true, data: { billData, billMembers } }),
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Error creating bill:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: (error as any).message,
      }),
      { status: 500 },
    );
  }
}
