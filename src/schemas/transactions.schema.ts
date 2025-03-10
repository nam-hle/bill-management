import { z } from "zod";

import type { Database } from "@/database.types";
import { GroupSchema } from "@/schemas/group.schema";
import { ClientUserSchema } from "@/schemas/user.schema";

export const TransactionStatusEnumSchema = z.enum([
	"Waiting",
	"Confirmed",
	"Declined"
] as const satisfies Database["public"]["Enums"]["TransactionStatus"][]);
export type TransactionStatus = z.infer<typeof TransactionStatusEnumSchema>;

export const ClientTransactionSchema = z.object({
	id: z.string(),
	amount: z.number(),
	group: GroupSchema,
	issuedAt: z.string(),
	createdAt: z.string(),
	sender: ClientUserSchema,
	receiver: ClientUserSchema,
	status: TransactionStatusEnumSchema,
	bankAccountId: z.string().nullable()
});
export type ClientTransaction = z.infer<typeof ClientTransactionSchema>;
