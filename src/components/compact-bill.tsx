"use client";

import { Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/shadcn/badge";
import { Card, CardContent } from "@/components/shadcn/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcn/avatar";

import { API } from "@/api";
import { getAvatarFallback } from "@/utils/avatar-fallback";
import { type ClientBill, type ClientBillMember } from "@/schemas";

const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat("en-US", { currency: "USD", style: "currency" }).format(amount);
};

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const AvatarGroup = ({ users, max = 3 }: { max?: number; users: ClientBillMember[] }) => {
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

const BillCard = ({ bill, currentUserId }: { bill: ClientBill; currentUserId: string }) => {
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

export function CompactRecentBillsWithAvatars({ currentUserId }: { currentUserId: string }) {
	const { data } = useQuery({
		queryKey: ["bills"],
		queryFn: () => API.Bills.List.query({ page: 1 })
	});

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-bold">Recent Bills</h2>
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{data?.data?.map((bill) => <BillCard bill={bill} key={bill.id} currentUserId={currentUserId} />)}
			</div>
		</div>
	);
}
