import React from "react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcn/avatar";

import { cn } from "@/utils/cn";
import { trpc } from "@/services";
import { type TestId, type ClassName } from "@/types";
import { getAvatarFallback } from "@/utils/avatar-fallback";

export namespace FallbackAvatar {
	export interface Props extends ClassName, TestId {
		fullName: string;
		avatar?: string | null;
	}
}

export const FallbackAvatar: React.FC<FallbackAvatar.Props> = (props) => {
	const { avatar, fullName, className } = props;
	const { data } = trpc.storage.get.useQuery({ bucketName: "avatars", fileName: avatar || "" }, { enabled: !!avatar });

	return (
		<Avatar data-testid={props["data-testid"]} className={cn("h-10 w-10", className)}>
			<AvatarImage src={data} alt={fullName} title={fullName} />
			<AvatarFallback title={fullName} data-testid="avatar-fallback">
				{getAvatarFallback(fullName)}
			</AvatarFallback>
		</Avatar>
	);
};
