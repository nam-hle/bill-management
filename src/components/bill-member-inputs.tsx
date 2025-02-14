import React from "react";
import { useQuery } from "@tanstack/react-query";
import { MdDeleteOutline } from "react-icons/md";
import { Input, Group, GridItem, InputAddon } from "@chakra-ui/react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

import { API } from "@/api";
import { Field } from "@/chakra/field";
import { Button } from "@/chakra/button";
import { Select } from "@/components/select";
import { Skeleton } from "@/chakra/skeleton";
import { type NewFormState } from "@/schemas/form.schema";

namespace BillMemberInputs {
	export interface Props {
		readonly editing?: boolean;
		readonly coordinate: { type: "creditor" } | { type: "debtor"; debtorIndex: number };
	}
}

export const BillMemberInputs: React.FC<BillMemberInputs.Props> = (props) => {
	const { editing, coordinate } = props;
	const {
		watch,
		control,
		register,
		getValues,
		formState: { errors }
	} = useFormContext<NewFormState>();

	const { isSuccess, isPending, data: usersResponse } = useQuery({ queryKey: ["users"], queryFn: API.Users.List.query });

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

	const { remove: removeDebtor } = useFieldArray({ control, name: "debtors" });

	watch("debtors");

	const members = React.useMemo(() => {
		if (!isSuccess) {
			return [];
		}

		if (coordinate.type === "creditor") {
			return usersResponse.data;
		}

		const debtors = getValues("debtors");

		return usersResponse.data.filter((user) => {
			if (user.id === debtors[coordinate.debtorIndex].userId) {
				return true;
			}

			return !debtors.some(({ userId }) => userId === user.id);
		});
	}, [getValues, coordinate, isSuccess, usersResponse]);

	const { selectLabel, amountLabel } = React.useMemo(() => {
		if (coordinate.type === "creditor") {
			return { selectLabel: "Creditor", amountLabel: "Total Amount" };
		}

		return { selectLabel: `Debtor ${coordinate.debtorIndex + 1}`, amountLabel: `Split Amount ${coordinate.debtorIndex + 1}` };
	}, [coordinate]);

	return (
		<>
			<GridItem colSpan={{ base: 5 }}>
				<Field required label={selectLabel} invalid={!!fieldError?.userId} errorText={fieldError?.userId?.message}>
					<Controller
						control={control}
						name={`${fieldKey}.userId`}
						render={({ field }) =>
							isPending ? (
								<Skeleton width="100%" height="40px" />
							) : (
								<Select
									{...register(`${fieldKey}.userId`)}
									readonly={!editing}
									onValueChange={field.onChange}
									value={isPending ? "" : field.value}
									items={members.map(({ id: value, fullName: label }) => ({ label, value }))}
								/>
							)
						}
					/>
				</Field>
			</GridItem>

			<GridItem colSpan={{ base: 3 }}>
				<Field required label={amountLabel} invalid={!!fieldError?.amount} errorText={fieldError?.amount?.message}>
					<Group attached width="100%">
						<Input {...register(`${fieldKey}.amount`)} textAlign="right" readOnly={!editing} pointerEvents={editing ? undefined : "none"} />
						<InputAddon>.000 VND</InputAddon>
					</Group>
				</Field>
			</GridItem>

			<GridItem alignSelf="flex-end" colSpan={{ base: 2 }} justifySelf="flex-end">
				{editing && coordinate.type === "debtor" && (
					<Button variant="subtle" colorPalette="red" onClick={() => removeDebtor(coordinate.debtorIndex)}>
						<MdDeleteOutline /> Delete
					</Button>
				)}
			</GridItem>
		</>
	);
};
