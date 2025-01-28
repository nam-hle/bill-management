import React from "react";
import type { Metadata } from "next";

import { getCurrentUser } from "@/supabase/server";

import ProfileForm from "./profile-form";

export const metadata: Metadata = {
	title: "Profile"
};

export default async function Profile() {
	const currentUser = await getCurrentUser();

	return <ProfileForm user={currentUser} />;
}
