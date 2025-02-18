"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { wait } from "@/utils";
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

	await wait(2000);

	if (!formData.success) {
		return formData.error.errors[0].message;
	}

	const { email, password, fullName } = formData.data;

	const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });

	if (error) {
		return error.message;
	}

	revalidatePath("/", "layout");
	redirect("/profile");
}
