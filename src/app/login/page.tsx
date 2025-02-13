import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createSupabaseServer } from "@/services";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
	title: "Login"
};

export default async function LoginPage() {
	const supabase = await createSupabaseServer();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	if (user) {
		redirect("/");
	}

	return <LoginForm />;
}
