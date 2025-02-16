import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginFormV2 } from "@/components/forms/login-form-v2";
import { createSupabaseServer } from "@/services/supabase/server";

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

	return <LoginFormV2 />;
}
