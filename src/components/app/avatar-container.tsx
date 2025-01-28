import { PiSignOut } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { FaRegUser } from "react-icons/fa6";
import { IconButton } from "@chakra-ui/react";
import { type User } from "@supabase/supabase-js";
import React, { useEffect, useCallback } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createSupabaseClient } from "@/supabase/client";
import { PopoverBody, PopoverRoot, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"];
const pickPalette = (name: string) => {
	const index = name.charCodeAt(0) % colorPalette.length;

	return colorPalette[index];
};

export const AvatarContainer: React.FC<{ user: User; avatarUrl: string | undefined }> = ({ user, avatarUrl }) => {
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
	const [open, setOpen] = React.useState(false);

	const signOut = React.useCallback(() => {
		fetch("/auth/signout", { method: "POST" }).then(() => {
			router.refresh();
		});
	}, [router]);

	if (loading) {
		return null;
	}

	return (
		<PopoverRoot size="lg" open={open} onOpenChange={(e) => setOpen(e.open)} positioning={{ placement: "bottom-end" }}>
			<PopoverTrigger asChild>
				<IconButton rounded="full" variant="ghost">
					<Avatar
						size="lg"
						as="button"
						src={avatarUrl}
						cursor="pointer"
						name={fullName ?? undefined}
						colorPalette={fullName ? pickPalette(fullName) : undefined}
					/>
				</IconButton>
			</PopoverTrigger>
			<PopoverContent width="150px">
				<PopoverArrow />
				<PopoverBody gap="{spacing.2}" flexDirection="column" padding="{spacing.1.5}">
					<Button size="sm" width="100%" variant="ghost" justifyContent="flex-start" onClick={() => router.push("/account")}>
						<FaRegUser />
						Profile
					</Button>
					<Button size="sm" width="100%" variant="ghost" onClick={signOut} justifyContent="flex-start">
						<PiSignOut />
						Sign out
					</Button>
				</PopoverBody>
			</PopoverContent>
		</PopoverRoot>
	);
};
