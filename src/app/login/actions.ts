"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { type LoginFormPayload } from "@/schemas";
import { createSupabaseServer } from "@/services";

export async function login(formData: LoginFormPayload) {
	const supabase = await createSupabaseServer();
	const { error } = await supabase.auth.signInWithPassword(formData);

	if (error) {
		return error.message;
	}

	revalidatePath("/", "layout");
	redirect("/");
}

export async function signup(formData: LoginFormPayload) {
	const supabase = await createSupabaseServer();

	const { error } = await supabase.auth.signUp(formData);

	if (error) {
		return error.message;
	}

	revalidatePath("/", "layout");
	redirect("/profile");
}
