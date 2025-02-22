import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcn/avatar";

import type { ClientBillMember } from "@/schemas";
import { getAvatarFallback } from "@/utils/avatar-fallback";

export const AvatarGroup = ({ users, max = 3 }: { max?: number; users: ClientBillMember[] }) => {
	const displayUsers = users.slice(0, max);
	const remaining = users.length - max;

	return (
		<div className="flex -space-x-2 overflow-hidden">
			{displayUsers.map((user) => (
				<Avatar key={user.userId} className="inline-block border-2 border-background">
					<AvatarImage alt={user.fullName} src={user.avatar ?? undefined} />
					<AvatarFallback>{getAvatarFallback(user.fullName)}</AvatarFallback>
				</Avatar>
			))}
			{remaining > 0 && (
				<Avatar className="inline-block border-2 border-background bg-muted">
					<AvatarFallback>+{remaining}</AvatarFallback>
				</Avatar>
			)}
		</div>
	);
};
