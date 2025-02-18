"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createSupabaseServer } from "@/services/supabase/server";
import { SignUpPayloadSchema, type LoginFormPayload } from "@/schemas";

export async function login(formData: LoginFormPayload) {
	const supabase = await createSupabaseServer();
	const { error } = await supabase.auth.signInWithPassword(formData);

	if (error) {
		return error.message;
	}

	revalidatePath("/", "layout");
	redirect("/");
}

export async function signup(payload: unknown) {
	const supabase = await createSupabaseServer();

	const formData = SignUpPayloadSchema.safeParse(payload);
	console.log({ formData });

	if (!formData.success) {
		return formData.error.errors[0].message;
	}

	const { error } = await supabase.auth.signUp(formData.data);
	console.log({ error });

	if (error) {
		return error.message;
	}

	revalidatePath("/", "layout");
	redirect("/profile");
}
