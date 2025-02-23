"use client";

import Link from "next/link";

import { AvatarGroup } from "@/components/avatar-group";
import { Card, CardContent } from "@/components/shadcn/card";
import { FallbackAvatar } from "@/components/fallbackable-avatar";

import { formatTime } from "@/utils";
import { type ClientBill } from "@/schemas";
import { formatCurrency } from "@/utils/format";

export const BillCard = ({ bill, currentUserId }: { bill: ClientBill; currentUserId: string }) => {
	const currentUserDebtor = bill.debtors.find((d) => d.userId === currentUserId);

	return (
		<Link passHref prefetch legacyBehavior href={`/bills/${bill.id}`}>
			<Card className="w-full cursor-pointer hover:border-gray-500">
				<CardContent className="p-4">
					<div className="flex items-start space-x-4">
						<FallbackAvatar {...bill.creditor} />
						<div className="min-w-0 flex-1">
							<h3 className="truncate text-sm font-medium">{bill.description}</h3>
							<span className="text-xs font-medium">{formatCurrency(bill.creditor.amount)}</span>
						</div>
						<div className="flex flex-col items-start">
							{currentUserDebtor && <span className="text-sm font-medium text-red-600">-{formatCurrency(currentUserDebtor.amount)}</span>}
						</div>
					</div>
					<div className="mt-2 flex items-center justify-between">
						<p className="truncate text-xs text-muted-foreground">{formatTime(bill.creator.timestamp)}</p>
						<AvatarGroup users={bill.debtors} />
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};
