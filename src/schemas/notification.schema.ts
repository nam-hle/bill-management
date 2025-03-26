import { z } from "zod";

import type { Database } from "@/database.types";
import { JsonSchema } from "@/schemas/base.schema";
import { TransactionSchema } from "@/schemas/transactions.schema";
import { ClientBillSchema, BillMemberRoleSchema } from "@/schemas/bills.schema";

const NotificationTypeSchema = z.enum([
	"BillCreated",
	"BillDeleted",
	"BillUpdated",
	"TransactionWaiting",
	"TransactionConfirmed",
	"TransactionDeclined"
] as const satisfies Database["public"]["Enums"]["NotificationType"][]);
export type NotificationType = z.infer<typeof NotificationTypeSchema>;

const ServerNotificationSchema = z.object({
	id: z.string(),
	createdAt: z.string(),
	readStatus: z.boolean(),
	metadata: JsonSchema.nullable()
});

const BaseClientNotificationSchema = ServerNotificationSchema.extend({
	type: NotificationTypeSchema,
	trigger: z.object({
		fullName: z.string()
	})
});

const NotificationBillSchema = ClientBillSchema.pick({ id: true, description: true }).extend({
	creator: z.object({ fullName: z.string() })
});

const BillCreatedNotificationMetadataSchema = z.object({
	previous: z.object({}),
	current: z.object({ amount: z.number(), role: BillMemberRoleSchema })
});
export type BillCreatedNotificationMetadata = z.infer<typeof BillCreatedNotificationMetadataSchema>;

const BillCreatedNotificationSchema = BaseClientNotificationSchema.extend({
	bill: NotificationBillSchema,
	type: z.literal("BillCreated"),
	metadata: BillCreatedNotificationMetadataSchema
});
export type BillCreatedNotification = z.infer<typeof BillCreatedNotificationSchema>;

const BillDeletedNotificationMetadataSchema = z.object({
	current: z.object({}),
	previous: z.object({ role: BillMemberRoleSchema })
});
export type BillDeletedNotificationMetadata = z.infer<typeof BillDeletedNotificationMetadataSchema>;

const BillDeletedNotificationSchema = BaseClientNotificationSchema.extend({
	bill: NotificationBillSchema,
	type: z.literal("BillDeleted"),
	metadata: BillDeletedNotificationMetadataSchema
});
export type BillDeletedNotification = z.infer<typeof BillDeletedNotificationSchema>;

const BillUpdatedNotificationMetadataSchema = z.object({
	current: z.object({ amount: z.number() }),
	previous: z.object({ amount: z.number() })
});
export type BillUpdatedNotificationMetadata = z.infer<typeof BillUpdatedNotificationMetadataSchema>;

const BillUpdatedNotificationSchema = BaseClientNotificationSchema.extend({
	bill: NotificationBillSchema,
	type: z.literal("BillUpdated"),
	metadata: BillUpdatedNotificationMetadataSchema
});
export type BillUpdatedNotification = z.infer<typeof BillUpdatedNotificationSchema>;

const TransactionWaitingNotificationSchema = BaseClientNotificationSchema.extend({
	transaction: TransactionSchema,
	type: z.literal("TransactionWaiting")
});
export type TransactionWaitingNotification = z.infer<typeof TransactionWaitingNotificationSchema>;

const TransactionConfirmedNotificationSchema = BaseClientNotificationSchema.extend({
	transaction: TransactionSchema,
	type: z.literal("TransactionConfirmed")
});
export type TransactionConfirmedNotification = z.infer<typeof TransactionConfirmedNotificationSchema>;

const TransactionDeclinedNotificationSchema = BaseClientNotificationSchema.extend({
	transaction: TransactionSchema,
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
