import { type UserFormState } from "@/types";
import { createClient } from "@/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = body as UserFormState;
    const supabase = await createClient();

    if (!payload.username) {
      throw new Error("username is required");
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({ username: payload.username })
      .select("id")
      .single();

    if (userError) {
      throw new Error(`Error inserting user: ${userError.message}`);
    }

    console.log("User successfully inserted:", userData);

    return new Response(JSON.stringify({ success: true, data: { userData } }), {
      status: 201,
    });
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
