"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/supabase/server";

interface LoginForm {
	email: string;
	password: string;
}

export async function login(formData: LoginForm) {
	const supabase = await createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const { error } = await supabase.auth.signInWithPassword(formData);

	if (error) {
		redirect("/error");
	}

	revalidatePath("/", "layout");
	redirect("/");
}

export async function signup(formData: LoginForm) {
	const supabase = await createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const { error } = await supabase.auth.signUp(formData);

	if (error) {
		redirect("/error");
	}

	revalidatePath("/", "layout");
	redirect("/account");
}
