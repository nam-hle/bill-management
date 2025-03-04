import { type MembershipStatus, MembershipStatusSchema } from "@/schemas/group.schema";

export enum MemberAction {
	REQUEST = "REQUEST",
	ACCEPT_REQUEST = "ACCEPT_REQUEST",
	REJECT_REQUEST = "REJECT_REQUEST",

	INVITE = "INVITE",
	ACCEPT_INVITE = "ACCEPT_INVITE",
	REJECT_INVITE = "REJECT_INVITE",

	LEAVE = "LEAVE",
	REMOVE = "REMOVE"
}

export function changeMemberStatus(
	status: MembershipStatus,
	action: MemberAction
): { ok: true; newStatus: MembershipStatus } | { ok: false; error: string } {
	switch (status) {
		case MembershipStatusSchema.enum.Idle:
			switch (action) {
				case MemberAction.REQUEST:
					return { ok: true, newStatus: MembershipStatusSchema.enum.Requesting };
				case MemberAction.ACCEPT_REQUEST:
				case MemberAction.REJECT_REQUEST:
					return { ok: false, error: `User did not request yet. Please invite instead.` };

				case MemberAction.INVITE:
					return { ok: true, newStatus: MembershipStatusSchema.enum.Inviting };
				case MemberAction.ACCEPT_INVITE:
				case MemberAction.REJECT_INVITE:
					return { ok: false, error: `You did not receive the invitation yet.` };

				case MemberAction.LEAVE:
				case MemberAction.REMOVE:
					return { ok: false, error: `User is not a member yet.` };
				default:
					throw new Error(`Invalid action ${action} for status ${status}`);
			}

		case MembershipStatusSchema.enum.Active:
			switch (action) {
				case MemberAction.LEAVE:
				case MemberAction.REMOVE:
					return { ok: true, newStatus: MembershipStatusSchema.enum.Idle };

				case MemberAction.REQUEST:
				case MemberAction.ACCEPT_REQUEST:
				case MemberAction.REJECT_REQUEST:
				case MemberAction.INVITE:
				case MemberAction.ACCEPT_INVITE:
				case MemberAction.REJECT_INVITE:
					return { ok: false, error: `User is already a member.` };
				default:
					throw new Error(`Invalid action ${action} for status ${status}`);
			}

		case MembershipStatusSchema.enum.Requesting:
			switch (action) {
				case MemberAction.REQUEST:
					return { ok: false, error: `User is already requested.` };
				case MemberAction.ACCEPT_REQUEST:
					return { ok: true, newStatus: MembershipStatusSchema.enum.Active };
				case MemberAction.REJECT_REQUEST:
					return { ok: true, newStatus: MembershipStatusSchema.enum.Idle };

				case MemberAction.INVITE:
				case MemberAction.ACCEPT_INVITE:
				case MemberAction.REJECT_INVITE:
					return { ok: false, error: `User is already requested.` };

				case MemberAction.LEAVE:
				case MemberAction.REMOVE:
					return { ok: false, error: `User is not a member yet.` };

				default:
					throw new Error(`Invalid action ${action} for status ${status}`);
			}

		case MembershipStatusSchema.enum.Inviting:
			switch (action) {
				case MemberAction.REQUEST:
				case MemberAction.ACCEPT_REQUEST:
				case MemberAction.REJECT_REQUEST:
					return { ok: false, error: `User is already invited. Please wait for the response.` };

				case MemberAction.INVITE:
					return { ok: false, error: `User is already invited` };
				case MemberAction.ACCEPT_INVITE:
					return { ok: true, newStatus: MembershipStatusSchema.enum.Active };
				case MemberAction.REJECT_INVITE:
					return { ok: true, newStatus: MembershipStatusSchema.enum.Idle };
				case MemberAction.LEAVE:
				case MemberAction.REMOVE:
					return { ok: false, error: `User is not a member yet.` };

				default:
					throw new Error(`Invalid action ${action} for status ${status}`);
			}

		default:
			throw new Error(`Invalid status ${status}`);
	}
}
