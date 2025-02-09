import React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/chakra/button";
import { toaster } from "@/chakra/toaster";
import { axiosInstance } from "@/services/axios";
import { capitalize, convertVerb } from "@/utils";
import { TransactionStatusEnumSchema } from "@/types";
import { type ClientTransaction } from "@/schemas/transactions.schema";

namespace TransactionAction {
	export interface Props {
		readonly currentUserId: string;
		readonly transaction: ClientTransaction;
	}
}

export const TransactionAction: React.FC<TransactionAction.Props> = ({ transaction, currentUserId }) => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ action, transactionId }: { transactionId: string; action: "confirm" | "decline" }) => {
			await axiosInstance.patch(`/transactions/${transactionId}/${action}`);
		},
		onError: (_, { action }) => {
			toaster.create({
				type: "error",
				title: "Error",
				description: `An error occurred while ${convertVerb(action).vIng} the transaction`
			});
		},
		onSuccess: (_, { action }) => {
			toaster.create({
				type: "success",
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
				size="xs"
				variant="solid"
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
				size="xs"
				variant="solid"
				colorPalette="red"
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
