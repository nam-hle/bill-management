import React from "react";
import { GridItem } from "@chakra-ui/react";

import type { ClientUser } from "@/types";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/app/select";
import { NumberInputRoot, NumberInputField } from "@/components/ui/number-input";

namespace BillMemberInputs {
	export interface Props {
		readonly label: string;
		readonly amount: string;
		readonly errorText?: string;
		readonly readonly?: boolean;
		readonly amountLabel: string;
		readonly action?: React.ReactNode;
		readonly userId: string | undefined;
		readonly users: readonly ClientUser[];

		onUserChange(userId: string): void;
		onAmountChange(string: string): void;
	}
}

export const BillMemberInputs: React.FC<BillMemberInputs.Props> = (props) => {
	const { users, label, userId, amount, action, readonly, errorText, amountLabel, onUserChange, onAmountChange } = props;

	return (
		<>
			<GridItem colSpan={{ base: 5 }}>
				<Select
					label={label}
					value={userId}
					readonly={readonly}
					onValueChange={onUserChange}
					items={users.map((user) => ({ value: user.id, label: user.fullName }))}
				/>
			</GridItem>

			<GridItem colSpan={{ base: 3 }}>
				<Field label={amountLabel} errorText={errorText} invalid={!!errorText}>
					<NumberInputRoot
						min={0}
						width="100%"
						value={amount}
						readOnly={readonly}
						pointerEvents={readonly ? "none" : undefined}
						onValueChange={(event) => onAmountChange(event.value)}>
						<NumberInputField />
					</NumberInputRoot>
				</Field>
			</GridItem>

			<GridItem alignSelf="flex-end" colSpan={{ base: 2 }} justifySelf="flex-end">
				{action}
			</GridItem>
		</>
	);
};
