"use client";

import React from "react";
import { X, Check } from "lucide-react";

import { Button } from "@/components/shadcn/button";

import { DataTable } from "@/components/data-table/data-table";

import { trpc } from "@/services";
import { useToast } from "@/hooks/use-toast";

namespace InvitesTable {
	export interface Props {
		action?: React.ReactNode;
	}
}

export const InvitesTable: React.FC<InvitesTable.Props> = (props) => {
	const { action } = props;

	const { data } = trpc.users.invites.useQuery();

	const { toast } = useToast();
	const utils = trpc.useUtils();
	const accept = trpc.groups.acceptInvite.useMutation({
		onError: () => {
			toast({ title: "Error", variant: "destructive", description: "An error occurred while joining the group" });
		},
		onSuccess: () => {
			toast({ title: "Congratulation", description: "You have successfully joined the group!" });
			utils.groups.groups.invalidate().then(() => utils.users.invites.invalidate());
		}
	});
	const reject = trpc.groups.rejectInvite.useMutation({
		onError: () => {
			toast({ title: "Error", variant: "destructive", description: "An error occurred while rejecting the group" });
		},
		onSuccess: () => {
			utils.users.invites.invalidate().then(() => toast({ title: "Rejected", description: "You have successfully rejected the invitation!" }));
		}
	});

	return (
		<DataTable
			action={action}
			title="Invites"
			pagination={{ fullSize: data?.length }}
			data={data?.map((row) => ({ ...row }))}
			columns={[
				{ key: "id", label: "Group ID", dataGetter: ({ row }) => row.group.displayId },
				{ key: "name", label: "Group Name", dataGetter: ({ row }) => row.group.name },
				{
					label: "",
					key: "actions",
					alignment: "right",
					dataGetter: ({ row }) => (
						<div className="flex justify-end gap-2">
							<Button size="sm" onClick={() => accept.mutate({ invitationId: row.id })}>
								<Check /> Accept
							</Button>
							<Button size="sm" variant="destructive" onClick={() => reject.mutate({ invitationId: row.id })}>
								<X /> Reject
							</Button>
						</div>
					)
				}
			]}
		/>
	);
};
