import React from "react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcn/avatar";

import { API } from "@/api";
import { cn } from "@/utils/cn";
import { type ClassName } from "@/types";
import { getAvatarFallback } from "@/utils/avatar-fallback";

namespace FallbackAvatar {
	export interface Props extends ClassName {
		fullName: string;
		avatar?: string | null;
	}
}

export const FallbackAvatar: React.FC<FallbackAvatar.Props> = ({ avatar, fullName, className }) => {
	const avatarFallback = API.Storage.useFileQuery("avatars", avatar ?? undefined);

	return (
		<Avatar className={cn("h-10 w-10", className)}>
			<AvatarImage alt={fullName} title={fullName} src={avatarFallback.data} />
			<AvatarFallback title={fullName}>{getAvatarFallback(fullName)}</AvatarFallback>
		</Avatar>
	);
};
