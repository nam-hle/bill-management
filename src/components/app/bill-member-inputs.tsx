import React from "react";
import { GridItem } from "@chakra-ui/react";

import type { ClientUser } from "@/types";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/app/select";
import { renderError, type MemberState } from "@/components/app/bill-form";
import { NumberInputRoot, NumberInputField } from "@/components/ui/number-input";

namespace BillMemberInputs {
	export interface Props {
		readonly label: string;
		readonly readonly?: boolean;
		readonly member: MemberState;
		readonly amountLabel: string;
		readonly validating: boolean;
		readonly action?: React.ReactNode;
		readonly users: readonly ClientUser[];

		onUserChange(userId: string): void;
		onAmountChange(string: string): void;
	}
}

export const BillMemberInputs: React.FC<BillMemberInputs.Props> = (props) => {
	const { users, label, member, action, readonly, validating, amountLabel, onUserChange, onAmountChange } = props;

	return (
		<>
			<GridItem colSpan={{ base: 5 }}>
				<Field required label={label} {...renderError(validating, member.user.error)}>
					<Select
						readonly={readonly}
						value={member.user.userId}
						onValueChange={onUserChange}
						items={users.map((user) => ({ value: user.id, label: user.fullName }))}
					/>
				</Field>
			</GridItem>

			<GridItem colSpan={{ base: 3 }}>
				<Field label={amountLabel} {...renderError(validating, member.amount.error)}>
					<NumberInputRoot
						min={0}
						width="100%"
						readOnly={readonly}
						value={member.amount.input}
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
