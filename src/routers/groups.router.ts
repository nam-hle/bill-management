import { z } from "zod";

import { ClientUserSchema } from "@/schemas";
import { MemberAction } from "@/controllers/member-transition";
import { GroupController } from "@/controllers/group.controller";
import { router, privateProcedure } from "@/services/trpc/server";
import { GroupSchema, MembershipSchema, MembershipStatusSchema, MembershipChangeResponseSchema } from "@/schemas/group.schema";

export const groupsRouter = router({
	members: privateProcedure
		.input(z.object({ groupId: z.string() }))
		.output(z.array(ClientUserSchema))
		.query(({ input, ctx: { supabase } }) => GroupController.getMembers(supabase, input)),
	invites: privateProcedure
		.input(z.object({ groupId: z.string() }))
		.output(z.array(MembershipSchema))
		.query(({ input, ctx: { supabase } }) =>
			GroupController.getMembershipsByStatus(supabase, { ...input, status: MembershipStatusSchema.enum.Inviting })
		),
	requests: privateProcedure
		.input(z.object({ groupId: z.string() }))
		.output(z.array(MembershipSchema))
		.query(({ input, ctx: { supabase } }) =>
			GroupController.getMembershipsByStatus(supabase, { ...input, status: MembershipStatusSchema.enum.Requesting })
		),

	create: privateProcedure
		.input(z.object({ name: z.string() }))
		.output(GroupSchema)
		.mutation(({ input, ctx: { user, supabase } }) => GroupController.create(supabase, { ...input, creatorId: user.id })),

	rejectRequest: privateProcedure
		.input(z.object({ requestId: z.string() }))
		.output(MembershipChangeResponseSchema)
		.mutation(({ input, ctx: { supabase } }) =>
			GroupController.resolvePendingStatus(supabase, { membershipId: input.requestId, action: MemberAction.REJECT_REQUEST })
		),
	acceptRequest: privateProcedure
		.input(z.object({ requestId: z.string() }))
		.output(MembershipChangeResponseSchema)
		.mutation(({ input, ctx: { supabase } }) =>
			GroupController.resolvePendingStatus(supabase, { membershipId: input.requestId, action: MemberAction.ACCEPT_REQUEST })
		),
	request: privateProcedure
		.input(z.object({ groupDisplayId: z.string() }))
		.output(MembershipChangeResponseSchema)
		.mutation(async ({ input, ctx: { user, supabase } }) => {
			const group = await GroupController.findGroupByDisplayId(supabase, { displayId: input.groupDisplayId });

			if (!group) {
				return { ok: false, error: "Group not found" };
			}

			return GroupController.changeMembershipStatus(supabase, { userId: user.id, groupId: group?.id, action: MemberAction.REQUEST });
		}),

	invite: privateProcedure
		.input(z.object({ userId: z.string(), groupId: z.string() }))
		.output(MembershipChangeResponseSchema)
		.mutation(({ input, ctx: { supabase } }) => GroupController.changeMembershipStatus(supabase, { ...input, action: MemberAction.INVITE })),
	acceptInvite: privateProcedure
		.input(z.object({ invitationId: z.string() }))
		.output(MembershipChangeResponseSchema)
		.mutation(({ input, ctx: { supabase } }) =>
			GroupController.resolvePendingStatus(supabase, { membershipId: input.invitationId, action: MemberAction.ACCEPT_INVITE })
		),
	rejectInvite: privateProcedure
		.input(z.object({ invitationId: z.string() }))
		.output(MembershipChangeResponseSchema)
		.mutation(({ input, ctx: { supabase } }) =>
			GroupController.resolvePendingStatus(supabase, { membershipId: input.invitationId, action: MemberAction.REJECT_INVITE })
		)
});
