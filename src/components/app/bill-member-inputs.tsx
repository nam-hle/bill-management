import React from "react";
import { GridItem } from "@chakra-ui/react";

import type { ClientUser } from "@/types";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/app/select";
import { NumberInputRoot, NumberInputField } from "@/components/ui/number-input";

namespace BillMemberInputs {
	export interface Props {
		label: string;
		disabled?: boolean;
		users: ClientUser[];
		action?: React.ReactNode;
		autoFilledAmount?: number;
		memberKind: "creditor" | "debtor";
		onUserChange: (userId: string) => void;
		onAmountChange: (amount: number) => void;
		value: { userId?: string; amount?: number };
	}
}

export const BillMemberInputs: React.FC<BillMemberInputs.Props> = (props) => {
	const { users, label, value, action, disabled, memberKind, onUserChange, onAmountChange, autoFilledAmount } = props;
	const [numberInput, setNumberInput] = React.useState(() => String(autoFilledAmount ?? value?.amount ?? ""));
	const [errorText, setErrorText] = React.useState(() => "");

	return (
		<>
			<GridItem colSpan={{ base: 5 }}>
				<Select
					label={label}
					readonly={disabled}
					value={value?.userId}
					onValueChange={onUserChange}
					items={users.map((user) => ({ value: user.id, label: user.fullName }))}
				/>
			</GridItem>

			<GridItem colSpan={{ base: 3 }}>
				<Field errorText={errorText} invalid={errorText !== ""} label={memberKind === "creditor" ? "Total Amount" : "Split Amount"}>
					<NumberInputRoot
						min={0}
						width="100%"
						disabled={disabled}
						color={autoFilledAmount !== undefined ? "grey" : undefined}
						value={autoFilledAmount !== undefined ? String(autoFilledAmount) : numberInput}
						onValueChange={(e) => {
							const input = e.value;

							if (input === "") {
								onAmountChange(0);
								setNumberInput(() => "");
								setErrorText("");

								return;
							}

							const amount = parseInt(input, 10);

							if (isNaN(amount)) {
								setNumberInput(() => input);
								setErrorText("Amount must be a number");

								return;
							}

							setNumberInput(String(amount));
							setErrorText("");
							onAmountChange(amount);
						}}>
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
