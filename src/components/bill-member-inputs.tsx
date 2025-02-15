import React from "react";
import { useQuery } from "@tanstack/react-query";
import { MdDeleteOutline } from "react-icons/md";
import { Controller, useFormContext } from "react-hook-form";
import { Input, Group, GridItem, InputAddon } from "@chakra-ui/react";

import { API } from "@/api";
import { Field } from "@/chakra/field";
import { Button } from "@/chakra/button";
import { Select } from "@/components/select";
import { Skeleton } from "@/chakra/skeleton";
import { type BillFormState } from "@/components/bill-form";
import { SkeletonWrapper } from "@/components/skeleton-wrapper";

namespace BillMemberInputs {
	export interface Props {
		readonly loading: boolean;
		readonly editing: boolean;
		readonly onRemove?: () => void;
		readonly member: { type: "creditor" } | { type: "debtor"; debtorIndex: number };
	}
}

export const BillMemberInputs: React.FC<BillMemberInputs.Props> = (props) => {
	const { member, editing, onRemove } = props;
	const {
		watch,
		control,
		register,
		getValues,
		formState: { errors }
	} = useFormContext<BillFormState>();

	const { isSuccess, data: usersResponse, isPending: isPendingUsers } = useQuery({ queryKey: ["users"], queryFn: API.Users.List.query });

	const fieldKey = React.useMemo(() => {
		if (member.type === "creditor") {
			return "creditor" as const;
		}

		return `debtors.${member.debtorIndex}` as const;
	}, [member]);

	const fieldError = React.useMemo(() => {
		if (member.type === "creditor") {
			return errors["creditor"];
		}

		return errors["debtors"]?.[member.debtorIndex];
	}, [member, errors]);

	watch("debtors");

	const members = React.useMemo(() => {
		if (!isSuccess) {
			return [];
		}

		if (member.type === "creditor") {
			return usersResponse.data;
		}

		const debtors = getValues("debtors");

		return usersResponse.data.filter((user) => {
			if (user.id === debtors[member.debtorIndex]?.userId) {
				return true;
			}

			return !debtors.some(({ userId }) => userId === user.id);
		});
	}, [getValues, member, isSuccess, usersResponse]);

	const { selectLabel, amountLabel } = React.useMemo(() => {
		if (member.type === "creditor") {
			return { selectLabel: "Creditor", amountLabel: "Total Amount" };
		}

		return { selectLabel: `Debtor ${member.debtorIndex + 1}`, amountLabel: `Split Amount ${member.debtorIndex + 1}` };
	}, [member]);

	const loadingUsers = React.useMemo(() => {
		return props.loading || isPendingUsers;
	}, [isPendingUsers, props.loading]);

	const loadingAmount = props.loading;

	return (
		<>
			<GridItem colSpan={{ base: 5 }}>
				<Field required label={selectLabel} invalid={!!fieldError?.userId} errorText={fieldError?.userId?.message}>
					<Controller
						control={control}
						name={`${fieldKey}.userId`}
						render={({ field }) => (
							<SkeletonWrapper loading={loadingUsers} skeleton={<Skeleton width="100%" height="40px" />}>
								<Select
									{...register(`${fieldKey}.userId`)}
									readonly={!editing}
									value={field.value}
									onValueChange={field.onChange}
									items={members.map(({ id: value, fullName: label }) => ({ label, value }))}
								/>
							</SkeletonWrapper>
						)}
					/>
				</Field>
			</GridItem>

			<GridItem colSpan={{ base: 3 }}>
				<Field label={amountLabel} invalid={!!fieldError?.amount} required={member.type === "creditor"} errorText={fieldError?.amount?.message}>
					<Group attached width="100%">
						<SkeletonWrapper loading={!!loadingAmount} skeleton={<Skeleton width="100%" height="40px" />}>
							<Input {...register(`${fieldKey}.amount`)} textAlign="right" readOnly={!editing} pointerEvents={editing ? undefined : "none"} />
						</SkeletonWrapper>
						<InputAddon>.000 VND</InputAddon>
					</Group>
				</Field>
			</GridItem>

			<GridItem alignSelf="flex-end" colSpan={{ base: 2 }} justifySelf="flex-end">
				{editing && (
					<Button variant="subtle" colorPalette="red" onClick={onRemove}>
						<MdDeleteOutline /> Delete
					</Button>
				)}
			</GridItem>
		</>
	);
};
