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
		amountLabel: string;
		users: ClientUser[];
		action: React.ReactNode;
		autoFilledAmount?: number;
		amount: number | undefined;
		userId: string | undefined;
		onUserChange(userId: string): void;
		onAmountChange(amount: number): void;
	}
}

export const BillMemberInputs: React.FC<BillMemberInputs.Props> = (props) => {
	const { users, label, userId, amount, action, disabled, amountLabel, onUserChange, onAmountChange, autoFilledAmount } = props;
	const [numberInput, setNumberInput] = React.useState(() => String(autoFilledAmount ?? amount ?? ""));
	const [errorText, setErrorText] = React.useState(() => "");

	return (
		<>
			<GridItem colSpan={{ base: 5 }}>
				<Select
					label={label}
					value={userId}
					readonly={disabled}
					onValueChange={onUserChange}
					items={users.map((user) => ({ value: user.id, label: user.fullName }))}
				/>
			</GridItem>

			<GridItem colSpan={{ base: 3 }}>
				<Field label={amountLabel} errorText={errorText} invalid={errorText !== ""}>
					<NumberInputRoot
						min={0}
						width="100%"
						readOnly={disabled}
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
