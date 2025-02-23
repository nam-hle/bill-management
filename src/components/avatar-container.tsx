import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import React, { use, Suspense } from "react";

import { Skeleton } from "@/components/shadcn/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcn/avatar";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuSeparator
} from "@/components/shadcn/dropdown-menu";

import { type UserInfo } from "@/types";
import { getAvatarFallback } from "@/utils/avatar-fallback";

export namespace AvatarContainer {
	export interface Props {
		readonly pendingUserInfo: Promise<UserInfo>;
	}
}

function UserNav(props: AvatarContainer.Props) {
	const userInfo = use(props.pendingUserInfo);

	return (
		<DropdownMenuTrigger asChild>
			<Avatar className="h-8 w-8 cursor-pointer">
				<AvatarImage src={userInfo?.avatarUrl} />
				<AvatarFallback className="text-sm">{getAvatarFallback(userInfo.fullName)}</AvatarFallback>
			</Avatar>
		</DropdownMenuTrigger>
	);
}

function UserNavInfo(props: AvatarContainer.Props) {
	const userInfo = use(props.pendingUserInfo);

	return (
		<DropdownMenuLabel className="font-normal">
			<div className="flex flex-col space-y-1">
				<p className="text-sm font-medium leading-none">{userInfo.fullName}</p>
				<p className="text-xs leading-none text-muted-foreground">{userInfo.email}</p>
			</div>
		</DropdownMenuLabel>
	);
}

export const AvatarContainer: React.FC<AvatarContainer.Props> = ({ pendingUserInfo }) => {
	const router = useRouter();
	const signOut = React.useCallback(() => {
		fetch("/auth/signout", { method: "POST" }).then(() => {
			router.refresh();
		});
	}, [router]);

	return (
		<DropdownMenu>
			<Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
				<UserNav pendingUserInfo={pendingUserInfo} />
			</Suspense>
			<DropdownMenuContent forceMount align="end" className="w-56">
				<UserNavInfo pendingUserInfo={pendingUserInfo} />
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profile")}>
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={signOut} className="cursor-pointer">
						<LogOut className="mr-2 h-4 w-4" />
						<span>Log out</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
