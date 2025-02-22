import React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/shadcn/button";

import { API } from "@/api";
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
	const mutation = useMutation({
		mutationFn: API.Transactions.Update.mutate,
		onError: (_, { action }) => {
			toast({
				title: "Error",
				variant: "destructive",
				description: `An error occurred while ${convertVerb(action).vIng} the transaction`
			});
		},
		onSuccess: (_, { action }) => {
			toast({
				// type: "success",
				title: `Transaction ${capitalize(convertVerb(action).pastTense)}`,
				description: `The transaction has been ${convertVerb(action).pastTense} successfully`
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
					mutation.mutate({ action: "confirm", transactionId: transaction.id });
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
					mutation.mutate({ action: "decline", transactionId: transaction.id });
				}}>
				Decline
			</Button>
		);
	}

	return null;
};
