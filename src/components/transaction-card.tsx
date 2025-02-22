import { Calendar } from "lucide-react";

import { Card, CardContent } from "@/components/shadcn/card";
import { TransactionStatusBadge } from "@/components/transaction-status-badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcn/avatar";

import { type ClientTransaction } from "@/schemas";
import { formatDate, formatCurrency } from "@/utils/format";
import { getAvatarFallback } from "@/utils/avatar-fallback";

import { Badge } from "./shadcn/badge";

export const TransactionCard = ({ transaction, currentUserId }: { currentUserId: string; transaction: ClientTransaction }) => {
	const isReceived = transaction.receiver.id === currentUserId;
	const other = isReceived ? transaction.sender : transaction.receiver;

	return (
		<Card className="w-full">
			<CardContent className="p-4">
				<div className="flex items-center space-x-4">
					<Avatar className="h-10 w-10">
						<AvatarImage src={undefined} alt={other.fullName} />
						<AvatarFallback>{getAvatarFallback(other.fullName)}</AvatarFallback>
					</Avatar>
					<div className="min-w-0 flex-1">
						<h3 className="truncate text-sm font-medium">{other.fullName}</h3>
						<TransactionStatusBadge status={transaction.status} />
					</div>
					<div className="flex flex-col items-end">
						<span className={`text-sm font-medium ${isReceived ? "text-green-600" : "text-red-600"}`}>
							{isReceived ? "+" : "-"}
							{formatCurrency(transaction.amount)}
						</span>
						<Badge variant="secondary" className="mt-1 text-xs">
							<Calendar className="mr-1 h-3 w-3" />
							{formatDate(transaction.issuedAt)}
						</Badge>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
