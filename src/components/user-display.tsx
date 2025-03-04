import React from "react";

import { FallbackAvatar } from "@/components/fallbackable-avatar";

import { type ClientUser } from "@/schemas";

export namespace UserDisplay {
	export interface Props extends ClientUser {}
}

export const UserDisplay: React.FC<UserDisplay.Props> = (props) => {
	return (
		<div data-testid="user-display" className="flex flex-row items-center gap-2">
			<FallbackAvatar {...props} />
			<p className="text-sm font-medium">{props.fullName}</p>
		</div>
	);
};
