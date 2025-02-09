import { Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { use, Suspense } from "react";

import { Avatar } from "@/chakra/avatar";
import { type UserInfo, type Container } from "@/types";
import { PopoverBody, PopoverRoot, PopoverArrow, PopoverContent, PopoverTrigger } from "@/chakra/popover";

const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"];
const pickPalette = (name: string | undefined) => {
	if (name === undefined) {
		return "blue";
	}

	const index = name.charCodeAt(0) % colorPalette.length;

	return colorPalette[index];
};

export namespace AvatarContainer {
	export interface Props {
		readonly userInfo?: Promise<UserInfo>;
	}
}

export const AvatarContainer: React.FC<AvatarContainer.Props> = ({ userInfo }) => {
	const [open, setOpen] = React.useState(false);

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
				<div>
					<Suspense fallback={<Avatar />}>
						<AsyncAvatar userInfo={userInfo} />
					</Suspense>
				</div>
			</PopoverTrigger>
			<PopoverContent width="150px">
				<PopoverArrow />
				<PopoverBody gap="{spacing.2}" flexDirection="column" padding="{spacing.1.5}">
					<MenuItem
						onClick={() => {
							router.push("/profile");
							setOpen(false);
						}}>
						Profile
					</MenuItem>
					<MenuItem onClick={signOut}>Sign out</MenuItem>
				</PopoverBody>
			</PopoverContent>
		</PopoverRoot>
	);
};

const AsyncAvatar: React.FC<AvatarContainer.Props> = (props) => {
	const user = props.userInfo ? use(props.userInfo) : undefined;

	return <Avatar size="sm" cursor="pointer" src={user?.avatarUrl} name={user?.fullName} colorPalette={pickPalette(user?.fullName)} />;
};

const MenuItem: React.FC<{ onClick(): void } & Container> = ({ onClick, children }) => {
	return (
		<Text width="100%" cursor="pointer" onClick={onClick} _hover={{ bg: "gray.200" }} paddingInline="{spacing.2}" paddingBlock="{spacing.1.5}">
			{children}
		</Text>
	);
};
