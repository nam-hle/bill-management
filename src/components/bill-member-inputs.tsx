import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Controller, useFormContext } from "react-hook-form";
import { Input, Group, GridItem, InputAddon } from "@chakra-ui/react";

import { API } from "@/api";
import { Field } from "@/chakra/field";
import { Select } from "@/components/select";
import { Skeleton } from "@/chakra/skeleton";
import { type NewFormState } from "@/schemas/form.schema";

namespace BillMemberInputs {
	export interface Props {
		readonly label: string;
		readonly readonly?: boolean;
		readonly amountLabel: string;
		readonly action?: React.ReactNode;

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
	const { label, action, readonly, coordinate, amountLabel } = props;
	const {
		watch,
		control,
		register,
		getValues,
		formState: { errors }
	} = useFormContext<NewFormState>();

	const {
		isSuccess,
		isPending,
		data: usersResponse
	} = useQuery({
		queryKey: ["users"],
		queryFn: () => API.Users.List.query()
	});

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

	watch("debtors");

	const users = React.useMemo(() => {
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

	return (
		<>
			<GridItem colSpan={{ base: 5 }}>
				<Field required label={label} invalid={!!fieldError?.userId} errorText={fieldError?.userId?.message}>
					<Controller
						control={control}
						name={`${fieldKey}.userId`}
						render={({ field }) =>
							isPending ? (
								<Skeleton width="100%" height="40px" />
							) : (
								<Select
									{...register(`${fieldKey}.userId`)}
									readonly={readonly}
									onValueChange={field.onChange}
									value={isPending ? "" : field.value}
									items={users.map(({ id: value, fullName: label }) => ({ label, value }))}
								/>
							)
						}
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
