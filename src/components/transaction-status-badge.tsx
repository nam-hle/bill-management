import React from "react";

import { Badge } from "@/components/shadcn/badge";

import { type TransactionStatus } from "@/schemas";

export const TransactionStatusBadge: React.FC<{ className?: string; status: TransactionStatus }> = ({ status, className }) => {
	return <Badge className={className}>{status}</Badge>;
	// return (
	// 	<Badge
	// 		size={size}
	// 		marginLeft="{spacing.2}"
	// 		colorPalette={
	// 			status === TransactionStatusEnumSchema.enum.Waiting ? undefined : status === TransactionStatusEnumSchema.enum.Confirmed ? "green" : "red"
	// 		}>
	// 		{status}
	// 	</Badge>
	// );
};
