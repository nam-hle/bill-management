import React from "react";
import { Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";

import { Label } from "@/components/shadcn/label";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Skeleton } from "@/components/shadcn/skeleton";
import { FormItem, FormField, FormControl, FormMessage } from "@/components/shadcn/form";

import { Select } from "@/components/inputs";
import { type BillFormState } from "@/components/bill-form";
import { RequiredLabel } from "@/components/required-label";
import { SkeletonWrapper } from "@/components/skeleton-wrapper";

import { API } from "@/api";

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

	const AmountLabel = member.type === "creditor" ? Label : RequiredLabel;

	return (
		<>
			<div className="col-span-5">
				<FormField
					control={control}
					name={`${fieldKey}.userId`}
					render={({ field }) => (
						<FormItem>
							<RequiredLabel htmlFor={`${fieldKey}.userId`}>{selectLabel}</RequiredLabel>
							<SkeletonWrapper loading={loadingUsers} skeleton={<Skeleton className="h-10 w-full" />}>
								<Select
									{...register(`${fieldKey}.userId`)}
									readonly={!editing}
									value={field.value}
									onValueChange={field.onChange}
									items={members.map(({ id: value, fullName: label }) => ({ label, value }))}
								/>
							</SkeletonWrapper>
						</FormItem>
					)}
				/>
			</div>

			<div className="col-span-3">
				<FormField
					control={control}
					name={`${fieldKey}.amount`}
					render={({ field }) => (
						<FormItem>
							<AmountLabel htmlFor={`${fieldKey}.amount`}>{amountLabel}</AmountLabel>
							<FormControl>
								<SkeletonWrapper loading={loadingAmount} skeleton={<Skeleton className="h-10 w-full" />}>
									<Input readOnly={!editing} className={editing ? "" : "pointer-events-none"} {...field} />
								</SkeletonWrapper>
							</FormControl>
							<FormMessage>{fieldError?.amount?.message}</FormMessage>
						</FormItem>
					)}
				/>
			</div>

			<div className="col-span-2 self-end justify-self-end">
				{editing && onRemove && (
					<Button size="sm" variant="outline" onClick={onRemove}>
						<Trash2 />
					</Button>
				)}
			</div>
		</>
	);
};
