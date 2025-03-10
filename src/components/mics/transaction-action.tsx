import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/shadcn/button";

import { trpc } from "@/services";
import { capitalize, convertVerb } from "@/utils";
import { type ClientTransaction, TransactionStatusEnumSchema } from "@/schemas";

namespace TransactionAction {
	export interface Props {
		readonly currentUserId: string;
		readonly transaction: ClientTransaction;
	}
}

export const TransactionAction: React.FC<TransactionAction.Props> = ({ transaction, currentUserId }) => {
	const router = useRouter();
	const utils = trpc.useUtils();

	const mutation = trpc.transactions.update.useMutation({
		onError: (_, { status }) => {
			toast.error(`Transaction ${capitalize(convertVerb(status).pastTense)}`);
		},
		onSuccess: (_, { status }) => {
			toast.success(`Transaction ${capitalize(convertVerb(status).pastTense)}`, {
				description: `The transaction has been ${convertVerb(status).pastTense} successfully`
			});

			utils.transactions.getMany.invalidate().then(() => router.refresh());
		}
	});

	if (transaction.status === TransactionStatusEnumSchema.enum.Waiting && transaction.receiver.userId === currentUserId) {
		return (
			<Button
				size="sm"
				onClick={(event) => {
					event.stopPropagation();
					mutation.mutate({ status: "Confirmed", transactionId: transaction.id });
				}}>
				Confirm
			</Button>
		);
	}

	if (transaction.status === TransactionStatusEnumSchema.enum.Waiting && transaction.sender.userId === currentUserId) {
		return (
			<Button
				size="sm"
				variant="destructive"
				onClick={(event) => {
					event.stopPropagation();
					mutation.mutate({ status: "Declined", transactionId: transaction.id });
				}}>
				Decline
			</Button>
		);
	}

	return null;
};
