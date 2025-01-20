import React from "react";
import type { Metadata } from "next";

import { createClient } from "@/supabase/server";

import AccountForm from "./account-form";

export const metadata: Metadata = {
	title: "Account"
};

export default async function Account() {
	const supabase = await createClient();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	return <AccountForm user={user} />;
}
