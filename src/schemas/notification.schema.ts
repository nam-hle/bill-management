import { z } from "zod";

import { API } from "@/api";
import type { Database } from "@/database.types";
import { JsonSchema } from "@/schemas/base.schema";
import { ClientBillSchema, BillMemberRoleEnumSchema } from "@/types";

import ClientTransactionSchema = API.Transactions.ClientTransactionSchema;

export const NotificationTypeSchema = z.enum([
	"BillCreated",
	"BillDeleted",
	"BillUpdated",
	"TransactionWaiting",
	"TransactionConfirmed",
	"TransactionDeclined"
] as const satisfies Database["public"]["Enums"]["NotificationType"][]);
export type NotificationType = z.infer<typeof NotificationTypeSchema>;

export const ServerNotificationSchema = z.object({
	id: z.string(),
	createdAt: z.string(),
	readStatus: z.boolean(),
	metadata: JsonSchema.nullable()
});

export type ServerNotification = z.infer<typeof ServerNotificationSchema>;

export const BaseClientNotificationSchema = ServerNotificationSchema.extend({
	type: NotificationTypeSchema,
	trigger: z.object({
		fullName: z.string()
	})
});

export interface BaseClientNotification extends z.infer<typeof BaseClientNotificationSchema> {}

const NotificationBillSchema = ClientBillSchema.pick({ id: true, description: true }).extend({
	creator: z.object({ fullName: z.string() })
});

export const BillCreatedNotificationMetadataSchema = z.object({
	previous: z.object({}),
	current: z.object({ amount: z.number(), role: BillMemberRoleEnumSchema })
});
export type BillCreatedNotificationMetadata = z.infer<typeof BillCreatedNotificationMetadataSchema>;

export const BillCreatedNotificationSchema = BaseClientNotificationSchema.extend({
	bill: NotificationBillSchema,
	type: z.literal("BillCreated"),
	metadata: BillCreatedNotificationMetadataSchema
});
export type BillCreatedNotification = z.infer<typeof BillCreatedNotificationSchema>;

export const BillDeletedNotificationMetadataSchema = z.object({
	current: z.object({}),
	previous: z.object({ role: BillMemberRoleEnumSchema })
});
export type BillDeletedNotificationMetadata = z.infer<typeof BillDeletedNotificationMetadataSchema>;

export const BillDeletedNotificationSchema = BaseClientNotificationSchema.extend({
	bill: NotificationBillSchema,
	type: z.literal("BillDeleted"),
	metadata: BillDeletedNotificationMetadataSchema
});
export type BillDeletedNotification = z.infer<typeof BillDeletedNotificationSchema>;

export const BillUpdatedNotificationMetadataSchema = z.object({
	current: z.object({ amount: z.number() }),
	previous: z.object({ amount: z.number() })
});
export type BillUpdatedNotificationMetadata = z.infer<typeof BillUpdatedNotificationMetadataSchema>;

export const BillUpdatedNotificationSchema = BaseClientNotificationSchema.extend({
	bill: NotificationBillSchema,
	type: z.literal("BillUpdated"),
	metadata: BillUpdatedNotificationMetadataSchema
});
export type BillUpdatedNotification = z.infer<typeof BillUpdatedNotificationSchema>;

export const TransactionWaitingNotificationSchema = BaseClientNotificationSchema.extend({
	transaction: ClientTransactionSchema,
	type: z.literal("TransactionWaiting")
});
export type TransactionWaitingNotification = z.infer<typeof TransactionWaitingNotificationSchema>;

export const TransactionConfirmedNotificationSchema = BaseClientNotificationSchema.extend({
	transaction: ClientTransactionSchema,
	type: z.literal("TransactionConfirmed")
});
export type TransactionConfirmedNotification = z.infer<typeof TransactionConfirmedNotificationSchema>;

export const TransactionDeclinedNotificationSchema = BaseClientNotificationSchema.extend({
	transaction: ClientTransactionSchema,
	type: z.literal("TransactionDeclined")
});
export type TransactionDeclinedNotification = z.infer<typeof TransactionDeclinedNotificationSchema>;

export const ClientNotificationSchema = z.union([
	BillCreatedNotificationSchema,
	BillDeletedNotificationSchema,
	BillUpdatedNotificationSchema,
	TransactionWaitingNotificationSchema,
	TransactionConfirmedNotificationSchema,
	TransactionDeclinedNotificationSchema
]);

export type ClientNotification = z.infer<typeof ClientNotificationSchema>;
