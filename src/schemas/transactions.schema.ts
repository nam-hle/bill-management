import { z } from "zod";

import { GroupSchema } from "@/schemas";
import type { Database } from "@/database.types";
import { UserMetaSchema } from "@/schemas/user.schema";

export const TransactionStatusEnumSchema = z.enum([
	"Waiting",
	"Confirmed",
	"Declined"
] as const satisfies Database["public"]["Enums"]["TransactionStatus"][]);
export type TransactionStatus = z.infer<typeof TransactionStatusEnumSchema>;

export const TransactionSchema = z
	.object({
		id: z.string(),
		displayId: z.string(),

		amount: z.number(),
		group: GroupSchema,
		issuedAt: z.string(),
		createdAt: z.string(),
		sender: UserMetaSchema,
		receiver: UserMetaSchema,
		status: TransactionStatusEnumSchema,
		bankAccountId: z.string().nullable()
	})
	.strict();
export type Transaction = z.infer<typeof TransactionSchema>;

export const TransactionCreatePayloadSchema = z.object({
	amount: z.number(),
	issuedAt: z.string(),
	receiverId: z.string().min(1, "Receiver is required"),
	bankAccountId: z.string().min(1, "Bank account is required")
});
export const TransactionUpdatePayloadSchema = z.object({
	transactionId: z.string(),
	status: TransactionStatusEnumSchema.exclude(["Waiting"])
});

export const TransactionSuggestionSchema = z.object({
	suggestion: z.object({ amount: z.number(), receiverId: z.string(), bankAccountId: z.string() }).optional()
});
export type TransactionSuggestion = z.infer<typeof TransactionSuggestionSchema>;

export const TransactionQRCreatePayloadSchema = z
	.object({
		amount: z.number(),
		receiverId: z.string(),
		bankAccountId: z.string()
	})
	.strict();
export type TransactionQRCreatePayload = z.infer<typeof TransactionQRCreatePayloadSchema>;
