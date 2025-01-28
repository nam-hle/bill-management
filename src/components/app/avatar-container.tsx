import { PiSignOut } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { IconButton } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

import { downloadImage } from "@/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PopoverBody, PopoverRoot, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"];
const pickPalette = (name: string) => {
	const index = name.charCodeAt(0) % colorPalette.length;

	return colorPalette[index];
};

export namespace AvatarContainer {
	export interface Props {
		user?: { fullName?: string; avatarUrl?: string };
	}
}

export const AvatarContainer: React.FC<AvatarContainer.Props> = ({ user }) => {
	const { fullName } = user ?? {};
	const [open, setOpen] = React.useState(false);

	const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

	useEffect(() => {
		downloadImage(user?.avatarUrl).then(setAvatarUrl);
	}, [user?.avatarUrl]);

	const router = useRouter();
	const signOut = React.useCallback(() => {
		fetch("/auth/signout", { method: "POST" }).then(() => {
			router.refresh();
		});
	}, [router]);

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
