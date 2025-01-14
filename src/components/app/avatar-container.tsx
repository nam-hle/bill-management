import { HStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { type User } from "@supabase/supabase-js";
import React, { useEffect, useCallback } from "react";

import { Avatar } from "@/components/ui/avatar";
import { createClient } from "@/supabase/client";
import { MenuItem, MenuRoot, MenuContent, MenuTrigger } from "@/components/ui/menu";
const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"];
const pickPalette = (name: string) => {
	const index = name.charCodeAt(0) % colorPalette.length;

	return colorPalette[index];
};

export const AvatarContainer: React.FC<{ user: User }> = ({ user }) => {
	const supabase = createClient();

	const [fullName, setFullname] = React.useState<string | null>(null);
	const [loading, setLoading] = React.useState(true);

	const getProfile = useCallback(async () => {
		try {
			setLoading(true);

			const { data, error, status } = await supabase.from("profiles").select(`fullName, username, website, avatar_url`).eq("id", user?.id).single();

			if (error && status !== 406) {
				console.log(error);
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
		<HStack gap="4" key={user.email}>
			<MenuRoot positioning={{ placement: "bottom-start" }}>
				<MenuTrigger asChild>
					<Avatar
						size="lg"
						as="button"
						cursor="pointer"
						name={fullName ?? undefined}
						onClick={() => {
							router.push("/account");
						}}
						colorPalette={fullName ? pickPalette(fullName) : undefined}
					/>
				</MenuTrigger>
				<MenuContent>
					<MenuItem value="profile">Profile</MenuItem>
					<MenuItem value="sign-out">Sign out</MenuItem>
				</MenuContent>
			</MenuRoot>
		</HStack>
	);
};
