import React from "react";

import { Badge } from "@/components/shadcn/badge";

import { type TransactionStatus } from "@/schemas";

export const TransactionStatusBadge: React.FC<{ className?: string; status: TransactionStatus }> = ({ status, className }) => {
	return (
		<Badge className={className} variant={status === "Declined" ? "destructive" : status === "Confirmed" ? "succeed" : "secondary"}>
			{status}
		</Badge>
	);
};
