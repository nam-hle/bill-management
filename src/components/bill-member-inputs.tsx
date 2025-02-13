import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input, Group, GridItem, InputAddon } from "@chakra-ui/react";

import { Field } from "@/chakra/field";
import { type ClientUser } from "@/schemas";
import { Select } from "@/components/select";
import { type NewFormState } from "@/schemas/form.schema";

namespace BillMemberInputs {
	export interface Props {
		readonly label: string;
		readonly readonly?: boolean;
		readonly amountLabel: string;
		readonly action?: React.ReactNode;
		readonly users: readonly ClientUser[];

		readonly coordinate:
			| {
					type: "creditor";
			  }
			| {
					type: "debtor";
					debtorIndex: number;
			  };

		onUserChange(userId: string): void;
		onAmountChange(string: string): void;
	}
}

export const BillMemberInputs: React.FC<BillMemberInputs.Props> = (props) => {
	const { users, label, action, readonly, amountLabel } = props;
	const {
		control,
		register,
		formState: { errors }
	} = useFormContext<NewFormState>(); // retrieve those props

	return (
		<>
			<GridItem colSpan={{ base: 5 }}>
				<Field required label={label} invalid={!!errors.creditor?.userId} errorText={errors.creditor?.userId?.message}>
					<Controller
						control={control}
						name="creditor.userId"
						render={({ field }) => (
							<Select
								name={label}
								readonly={readonly}
								value={field.value}
								onValueChange={field.onChange}
								items={users.map((user) => ({ value: user.id, label: user.fullName }))}
							/>
						)}
					/>
				</Field>
			</GridItem>

			<GridItem colSpan={{ base: 3 }}>
				<Field required label={amountLabel} invalid={!!errors.creditor?.amount} errorText={errors.creditor?.amount?.message}>
					<Group attached width="100%">
						<Input {...register("creditor.amount")} textAlign="right" readOnly={readonly} pointerEvents={readonly ? "none" : undefined} />
						<InputAddon>.000 VND</InputAddon>
					</Group>
				</Field>
			</GridItem>

			<GridItem alignSelf="flex-end" colSpan={{ base: 2 }} justifySelf="flex-end">
				{action}
			</GridItem>
		</>
	);
};
