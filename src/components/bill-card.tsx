"use client";

import { Calendar } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { AvatarGroup } from "@/components/avatar-group";
import { Card, CardContent } from "@/components/shadcn/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcn/avatar";

import { type ClientBill } from "@/schemas";
import { formatDate, formatCurrency } from "@/utils/format";
import { getAvatarFallback } from "@/utils/avatar-fallback";

export const BillCard = ({ bill, currentUserId }: { bill: ClientBill; currentUserId: string }) => {
	const currentUserDebtor = bill.debtors.find((d) => d.userId === currentUserId);
	const otherDebtors = bill.debtors.filter((d) => d.userId !== currentUserId);

	return (
		<Card className="w-full">
			<CardContent className="p-4">
				<div className="flex items-center space-x-4">
					<Avatar className="h-10 w-10">
						<AvatarImage alt={bill.creditor.fullName} src={bill.creditor.avatar ?? undefined} />
						<AvatarFallback>{getAvatarFallback(bill.creditor.fullName)}</AvatarFallback>
					</Avatar>
					<div className="min-w-0 flex-1">
						<h3 className="truncate text-sm font-medium">{bill.description}</h3>
						<p className="truncate text-sm text-muted-foreground">{bill.creditor.fullName}</p>
					</div>
					<div className="flex flex-col items-end">
						<span className="text-sm font-medium">{formatCurrency(bill.creditor.amount)}</span>
						{currentUserDebtor && <span className="text-xs font-medium text-red-600">You owe: {formatCurrency(currentUserDebtor.amount)}</span>}
						<Badge variant="secondary" className="mt-1 text-xs">
							<Calendar className="mr-1 h-3 w-3" />
							{formatDate(bill.issuedAt)}
						</Badge>
					</div>
				</div>
				<div className="mt-3 flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<span className="text-xs text-muted-foreground">Debtors:</span>
						<AvatarGroup max={3} users={otherDebtors} />
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
