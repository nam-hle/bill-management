import React from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/shadcn/button";

import { trpc } from "@/services";
import { useToast } from "@/hooks/use-toast";
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
	const queryClient = useQueryClient();

	const { toast } = useToast();
	const mutation = trpc.transactions.update.useMutation({
		onError: (_, { status }) => {
			toast({
				variant: "destructive",
				title: `Transaction ${capitalize(convertVerb(status).pastTense)}`,
				description: `An error occurred while ${convertVerb(status).vIng} the transaction`
			});
		},
		onSuccess: (_, { status }) => {
			toast({
				title: `Transaction ${capitalize(convertVerb(status).pastTense)}`,
				description: `The transaction has been ${convertVerb(status).pastTense} successfully`
			});
			queryClient.invalidateQueries({ queryKey: ["transactions"] }).then(() => {
				router.refresh();
			});
		}
	});

	if (transaction.status === TransactionStatusEnumSchema.enum.Waiting && transaction.receiver.id === currentUserId) {
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

	if (transaction.status === TransactionStatusEnumSchema.enum.Waiting && transaction.sender.id === currentUserId) {
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
