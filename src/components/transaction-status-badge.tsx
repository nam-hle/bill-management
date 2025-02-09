import React from "react";
import { Badge, type BadgeProps } from "@chakra-ui/react";

import { type TransactionStatus, TransactionStatusEnumSchema } from "@/types";

export const TransactionStatusBadge: React.FC<{ status: TransactionStatus } & BadgeProps> = ({ status, size = "lg" }) => {
	return (
		<Badge
			size={size}
			marginLeft="{spacing.2}"
			colorPalette={
				status === TransactionStatusEnumSchema.enum.Waiting ? undefined : status === TransactionStatusEnumSchema.enum.Confirmed ? "green" : "red"
			}>
			{status}
		</Badge>
	);
};
