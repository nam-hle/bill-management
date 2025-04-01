import { Avatar, AvatarFallback } from "@/components/shadcn/avatar";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/shadcn/tooltip";

import { FallbackAvatar } from "@/components/avatars/fallbackable-avatar";

import type { UserMeta } from "@/schemas";

export const AvatarGroup = ({ users, online, max = 3 }: { max?: number; online?: boolean; users: UserMeta[] }) => {
	const totalUsers = users.length;
	const displayUsers = totalUsers === max + 1 ? users : users.slice(0, max);
	const remaining = totalUsers - displayUsers.length;

	return (
		<div className="flex -space-x-2 overflow-hidden">
			{displayUsers.map((user) => (
				<FallbackAvatar {...user} key={user.userId} className="inline-block border-2 border-background" />
			))}
			{remaining > 0 && (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Avatar className="inline-block border-2 border-background bg-muted">
								<AvatarFallback className="text-xs">+{remaining}</AvatarFallback>
							</Avatar>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<p>
								{remaining} more {online ? "online" : "users"}
							</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}
		</div>
	);
};
