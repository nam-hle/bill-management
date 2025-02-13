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
	}
}

export const BillMemberInputs: React.FC<BillMemberInputs.Props> = (props) => {
	const { users, label, action, readonly, coordinate, amountLabel } = props;
	const {
		control,
		register,
		formState: { errors }
	} = useFormContext<NewFormState>();

	const fieldKey = React.useMemo(() => {
		if (coordinate.type === "creditor") {
			return "creditor" as const;
		}

		return `debtors.${coordinate.debtorIndex}` as const;
	}, [coordinate]);

	const fieldError = React.useMemo(() => {
		if (coordinate.type === "creditor") {
			return errors["creditor"];
		}

		return errors["debtors"]?.[coordinate.debtorIndex];
	}, [coordinate, errors]);

	return (
		<>
			<GridItem colSpan={{ base: 5 }}>
				<Field required label={label} invalid={!!fieldError?.userId} errorText={fieldError?.userId?.message}>
					<Controller
						control={control}
						name={`${fieldKey}.userId`}
						render={({ field }) => (
							<Select
								{...register(`${fieldKey}.userId`)}
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
				<Field required label={amountLabel} invalid={!!fieldError?.amount} errorText={fieldError?.amount?.message}>
					<Group attached width="100%">
						<Input {...register(`${fieldKey}.amount`)} textAlign="right" readOnly={readonly} pointerEvents={readonly ? "none" : undefined} />
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
