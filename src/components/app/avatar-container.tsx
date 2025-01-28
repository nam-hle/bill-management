import { PiSignOut } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { IconButton } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

import { downloadImage } from "@/utils";
import { type Container } from "@/types";
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
		downloadImage("avatar", user?.avatarUrl).then(setAvatarUrl);
	}, [user?.avatarUrl]);

	const router = useRouter();
	const signOut = React.useCallback(() => {
		fetch("/auth/signout", { method: "POST" }).then(() => {
			setOpen(false);
			router.refresh();
		});
	}, [router]);

	return (
		<PopoverRoot size="lg" open={open} onOpenChange={(e) => setOpen(e.open)} positioning={{ placement: "bottom-end" }}>
			<PopoverTrigger asChild>
				<IconButton rounded="full" variant="ghost">
					<Avatar
						size="sm"
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
					<MenuItem
						onClick={() => {
							router.push("/profile");
							setOpen(false);
						}}>
						<FaRegUser />
						Profile
					</MenuItem>
					<MenuItem onClick={signOut}>
						<PiSignOut />
						Sign out
					</MenuItem>
				</PopoverBody>
			</PopoverContent>
		</PopoverRoot>
	);
};

const MenuItem: React.FC<{ onClick(): void } & Container> = ({ onClick, children }) => {
	return (
		<Button size="sm" width="100%" variant="ghost" onClick={onClick} justifyContent="flex-start">
			{children}
		</Button>
	);
};
