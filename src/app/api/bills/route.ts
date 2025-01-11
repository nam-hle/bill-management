import { type BillFormState } from "@/types";
import { createClient } from "@/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = body as BillFormState;
    const supabase = await createClient();

    const { data: billData, error: billError } = await supabase
      .from("bills")
      .insert({
        description: payload.description,
        creator_id: payload.creditor.userId,
        total_amount: payload.creditor.amount,
      })
      .select("id")
      .single();
    console.log(billError);

    if (billError) {
      throw new Error(`Error inserting bill: ${billError.message}`);
    }

    const billId = billData.id;

    // Step 2: Insert bill members
    const billMembers = payload.debtors.map((debtor) => ({
      bill_id: billId,
      user_id: debtor.userId,
      amount: debtor.amount,
    }));

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

    // // Validate the input
    // if (!description || !amount || !dueDate) {
    //   return new Response(
    //     JSON.stringify({ error: "All fields are required" }),
    //     {
    //       status: 400,
    //     },
    //   );
    // }
    //
    // // Create the bill record
    // const newBill = await prisma.bill.create({
    //   data: { description, amount, dueDate },
    // });

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
