import { z } from "zod";

import { ClientUserSchema } from "@/schemas";
import { MemberAction } from "@/controllers/member-transition";
import { GroupController } from "@/controllers/group.controller";
import { router, privateProcedure } from "@/services/trpc/server";
import { GroupSchema, MembershipSchema, GroupDetailsSchema, MembershipStatusSchema, MembershipChangeResponseSchema } from "@/schemas/group.schema";

export const groupsRouter = router({
	group: privateProcedure
		.input(z.object({ displayId: z.string() }))
		.output(GroupDetailsSchema)
		.query(({ input, ctx: { supabase } }) => GroupController.getGroupDetailsByDisplayId(supabase, input)),

	groups: privateProcedure
		.output(z.array(GroupDetailsSchema))
		.query(({ ctx: { user, supabase } }) => GroupController.getGroups(supabase, { userId: user.id })),

	members: privateProcedure
		.input(z.object({ groupId: z.string() }))
		.output(z.array(ClientUserSchema))
		.query(({ input, ctx: { supabase } }) => GroupController.getActiveMembers(supabase, input)),
	candidateMembers: privateProcedure
		.input(z.object({ groupId: z.string(), textSearch: z.string() }))
		.output(z.array(ClientUserSchema))
		.query(({ input, ctx: { supabase } }) => GroupController.getCandidateMembers(supabase, input)),
	invites: privateProcedure
		.input(z.object({ groupId: z.string() }))
		.output(z.array(MembershipSchema))
		.query(({ input, ctx: { supabase } }) =>
			GroupController.getMembershipsByStatus(supabase, { ...input, statuses: [MembershipStatusSchema.enum.Inviting] })
		),
	requests: privateProcedure
		.input(z.object({ groupId: z.string() }))
		.output(z.array(MembershipSchema))
		.query(({ input, ctx: { supabase } }) =>
			GroupController.getMembershipsByStatus(supabase, { ...input, statuses: [MembershipStatusSchema.enum.Requesting] })
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
				return { ok: false, error: `Group ${input.groupDisplayId} does not exist` };
			}

			return GroupController.changeMembershipStatus(supabase, { userId: user.id, groupId: group?.id, action: MemberAction.REQUEST });
		}),

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
		),
	invite: privateProcedure
		.input(z.object({ groupId: z.string(), userIds: z.array(z.string()) }))
		.output(z.array(MembershipChangeResponseSchema))
		.mutation(({ input, ctx: { supabase } }) => {
			return Promise.all(
				input.userIds.map((userId) => {
					return GroupController.changeMembershipStatus(supabase, { ...input, userId, action: MemberAction.INVITE });
				})
			);
		})
});
