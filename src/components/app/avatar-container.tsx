import { useRouter } from "next/navigation";
import { type User } from "@supabase/supabase-js";
import React, { useEffect, useCallback } from "react";

import { Avatar } from "@/components/ui/avatar";
import { createSupabaseClient } from "@/supabase/client";

const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"];
const pickPalette = (name: string) => {
	const index = name.charCodeAt(0) % colorPalette.length;

	return colorPalette[index];
};

export const AvatarContainer: React.FC<{ user: User }> = ({ user }) => {
	const supabase = createSupabaseClient();

	const [fullName, setFullname] = React.useState<string | null>(null);
	const [loading, setLoading] = React.useState(true);

	const getProfile = useCallback(async () => {
		try {
			setLoading(true);

			const { data, error, status } = await supabase
				.from("profiles")
				.select(`fullName:full_name, username, website, avatar_url`)
				.eq("id", user?.id)
				.single();

			if (error && status !== 406) {
				throw error;
			}

			if (data) {
				setFullname(data.fullName);
			}
		} catch (error) {
			alert("Error loading user data!");
		} finally {
			setLoading(false);
		}
	}, [user, supabase]);

	const router = useRouter();
	useEffect(() => {
		getProfile();
	}, [user, getProfile]);

	if (loading) {
		return null;
	}

	return (
		<Avatar
			size="lg"
			as="button"
			cursor="pointer"
			name={fullName ?? undefined}
			onClick={() => router.push("/account")}
			colorPalette={fullName ? pickPalette(fullName) : undefined}
		/>
	);
};
