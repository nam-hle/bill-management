import React from "react";
import { Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Skeleton } from "@/components/shadcn/skeleton";
import { FormItem, FormField, FormLabel, FormControl, FormMessage } from "@/components/shadcn/form";

import { Select } from "@/components/inputs";
import { RequiredLabel } from "@/components/required-label";
import { SkeletonWrapper } from "@/components/skeleton-wrapper";
import { type BillFormState } from "@/components/forms/bill-form";

import { trpc } from "@/services";

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
	const { watch, control, register, getValues } = useFormContext<BillFormState>();

	const { isSuccess, data: usersResponse, isPending: isPendingUsers } = trpc.users.get.useQuery();

	const fieldKey = React.useMemo(() => {
		if (member.type === "creditor") {
			return "creditor" as const;
		}

		return `debtors.${member.debtorIndex}` as const;
	}, [member]);

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

	const AmountLabel = member.type === "creditor" ? FormLabel : RequiredLabel;

	return (
		<>
			<div className="col-span-5">
				<FormField
					control={control}
					name={`${fieldKey}.userId`}
					render={({ field }) => (
						<FormItem>
							<RequiredLabel>{selectLabel}</RequiredLabel>
							<SkeletonWrapper loading={loadingUsers} skeleton={<Skeleton className="h-10 w-full" />}>
								<Select
									{...register(`${fieldKey}.userId`)}
									disabled={!editing}
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
							<AmountLabel>{amountLabel}</AmountLabel>
							<FormControl>
								<SkeletonWrapper loading={loadingAmount} skeleton={<Skeleton className="h-10 w-full" />}>
									<Input readOnly={!editing} className={editing ? "" : "pointer-events-none"} {...field} />
								</SkeletonWrapper>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<div className="col-span-2 self-end justify-self-end">
				{editing && onRemove && (
					<Button size="sm" variant="outline" onClick={onRemove} title="Delete debtor">
						<Trash2 />
					</Button>
				)}
			</div>
		</>
	);
};
