import React from "react";
import type { Metadata } from "next";

import { getCurrentUser } from "@/supabase/server";

import AccountForm from "./account-form";

export const metadata: Metadata = {
	title: "Account"
};

export default async function Account() {
	const currentUser = await getCurrentUser();

	return <AccountForm user={currentUser} />;
}
