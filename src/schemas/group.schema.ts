import { z } from "zod";

import type { Database } from "@/database.types";
import { ClientUserSchema } from "@/schemas/user.schema";

const NewGroupFormStateSchema = z.object({
	name: z.string().min(1, "Group name is required")
});
export type NewGroupFormState = z.infer<typeof NewGroupFormStateSchema>;

export const GroupSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayId: z.string()
});
export type Group = z.infer<typeof GroupSchema>;

export const GroupDetailsSchema = NewGroupFormStateSchema.extend({
	id: z.string(),
	displayId: z.string(),
	members: z.array(ClientUserSchema)
});
export type GroupDetails = z.infer<typeof GroupDetailsSchema>;

export const GroupDetailsWithBalanceSchema = GroupDetailsSchema.extend({
	balance: z.number()
});
export type GroupDetailsWithBalance = z.infer<typeof GroupDetailsWithBalanceSchema>;

export const MembershipStatusSchema = z.enum([
	"Idle",
	"Inviting",
	"Requesting",
	"Active"
] as const satisfies Database["public"]["Enums"]["MembershipStatus"][]);
export type MembershipStatus = z.infer<typeof MembershipStatusSchema>;

export const MembershipChangeResponseSchema = z.union([z.object({ ok: z.literal(true) }), z.object({ error: z.string(), ok: z.literal(false) })]);
export type MembershipResponseChange = z.infer<typeof MembershipChangeResponseSchema>;

export interface MembershipKey {
	userId: string;
	groupId: string;
}

export const MembershipSchema = z.object({
	id: z.string(),
	user: ClientUserSchema
});
export type Membership = z.infer<typeof MembershipSchema>;

export const InviteSchema = z.object({
	id: z.string(),
	group: GroupSchema
});
export type Invite = z.infer<typeof InviteSchema>;
