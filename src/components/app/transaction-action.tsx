import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";
import { capitalize, convertVerb } from "@/utils";
import { type ClientTransaction, TransactionStatusEnumSchema } from "@/types";
namespace TransactionAction {
	export interface Props {
		readonly currentUserId: string;
		readonly transaction: ClientTransaction;
	}
}

export const TransactionAction: React.FC<TransactionAction.Props> = ({ transaction, currentUserId }) => {
	const router = useRouter();

	const createHandler = React.useCallback(
		(transactionId: string, status: "confirm" | "decline") => {
			return async () => {
				fetch(`/api/transactions/${transactionId}/${status}`, { method: "PATCH" }).then((response) => {
					if (response.ok) {
						toaster.create({
							type: "success",
							title: `Transaction ${capitalize(convertVerb(status).pastTense)}`,
							description: `The transaction has been ${convertVerb(status).pastTense} successfully`
						});
						router.refresh();
					} else {
						toaster.create({
							type: "error",
							title: "Error",
							description: `An error occurred while ${convertVerb(status).vIng} the transaction`
						});
					}
				});
			};
		},
		[router]
	);

	if (transaction.status === TransactionStatusEnumSchema.enum.Waiting && transaction.receiver.id === currentUserId) {
		return (
			<Button variant="solid" onClick={createHandler(transaction.id, "confirm")}>
				Confirm
			</Button>
		);
	}

	if (transaction.status === TransactionStatusEnumSchema.enum.Waiting && transaction.sender.id === currentUserId) {
		return (
			<Button variant="solid" onClick={createHandler(transaction.id, "decline")}>
				Decline
			</Button>
		);
	}

	return null;
};
