import React from "react";
import type { Metadata } from "next";

import { ProfileForm } from "@/components/app/profile-form";
import { getCurrentUser, createSupabaseServer } from "@/supabase/server";
import { BankAccountsTable } from "@/components/app/bank-accounts-table";

export const metadata: Metadata = {
	title: "Profile"
};

export default async function Profile() {
	const currentUser = await getCurrentUser();
	const supabase = await createSupabaseServer();

	const { data } = await supabase.from("profiles").select(`fullName:full_name, avatarUrl:avatar_url`).eq("id", currentUser.id).single();

	if (!data) {
		throw new Error("Profile not found");
	}

	if (!currentUser.email) {
		throw new Error("Email not found");
	}

	return (
		<>
			<ProfileForm userId={currentUser.id} fullName={data.fullName} email={currentUser.email} avatarUrl={data.avatarUrl} />
			<BankAccountsTable currentUserId={currentUser.id} />
		</>
	);
}
