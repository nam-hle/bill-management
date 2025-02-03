import { z } from "zod";

import { ClientUserSchema, TransactionStatusEnumSchema } from "@/types";

export const ClientTransactionSchema = z.object({
	id: z.string(),
	amount: z.number(),
	issuedAt: z.string(),
	createdAt: z.string(),
	sender: ClientUserSchema,
	receiver: ClientUserSchema,
	status: TransactionStatusEnumSchema
});
export type ClientTransaction = z.infer<typeof ClientTransactionSchema>;
