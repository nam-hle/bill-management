"use client";

import { z } from "zod";
import React from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ban, Plus, Check, Pencil } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";

import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Form, FormItem, FormField, FormControl, FormMessage } from "@/components/shadcn/form";

import { ImageDialog } from "@/components/dialogs/image-dialog";
import { RequiredLabel } from "@/components/forms/required-label";
import { FileUpload } from "@/components/forms/inputs/file-upload";
import { SkeletonWrapper } from "@/components/mics/skeleton-wrapper";
import { BillFormHeading } from "@/components/forms/bill-form-heading";
import { BillMemberInputs } from "@/components/forms/inputs/bill-member-inputs";

import { API } from "@/api";
import { trpc } from "@/services";
import { useBoolean } from "@/hooks";
import { CLIENT_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/utils";
import { type ClientBill, type ClientBillMember } from "@/schemas";
import {
	IssuedAtField,
	IssuedAtFieldTransformer,
	OptionalAmountFieldSchema,
	RequiredAmountFieldSchema,
	OptionalAmountFieldTransformer,
	RequiredAmountFieldTransformer
} from "@/schemas/form.schema";

export namespace BillForm {
	export type Kind = { readonly type: "create" } | { readonly type: "update"; readonly billId: string };

	export interface Props {
		readonly kind: Kind;
	}
}

const CreditorSchema = z.object({ userId: z.string().min(1, "Creditor is required"), amount: RequiredAmountFieldSchema("Total amount is required") });
export namespace CreditorTransformer {
	export function toServer(member: z.infer<typeof CreditorSchema>) {
		return { ...member, amount: RequiredAmountFieldTransformer.toServer(member.amount) };
	}

	export function fromServer(member: ClientBillMember): z.infer<typeof CreditorSchema> {
		return { ...member, userId: member.user.userId, amount: RequiredAmountFieldTransformer.fromServer(member.amount) };
	}
}

const DebtorSchema = z.object({ amount: OptionalAmountFieldSchema, userId: z.string().min(1, "Debtor is required") });
export namespace DebtorTransformer {
	export function toServer(member: z.infer<typeof DebtorSchema>) {
		return { ...member, amount: OptionalAmountFieldTransformer.toServer(member.amount) };
	}

	export function fromServer(member: ClientBillMember): z.infer<typeof DebtorSchema> {
		return { ...member, userId: member.user.userId, amount: OptionalAmountFieldTransformer.fromServer(member.amount) };
	}
}

const BillFormStateSchema = API.Bills.UpsertBillSchema.extend({
	issuedAt: IssuedAtField,
	creditor: CreditorSchema,
	debtors: z.array(DebtorSchema)
});

export type BillFormState = z.infer<typeof BillFormStateSchema>;
namespace BillFormStateTransformer {
	export function fromServer(bill: ClientBill): BillFormState {
		return {
			...bill,
			creditor: CreditorTransformer.fromServer(bill.creditor),
			debtors: bill.debtors.map(DebtorTransformer.fromServer),
			issuedAt: IssuedAtFieldTransformer.fromServer(bill.issuedAt)
		};
	}

	export function toServer(formState: BillFormState): API.Bills.UpsertBill {
		return {
			...formState,
			creditor: CreditorTransformer.toServer(formState.creditor),
			debtors: formState.debtors.map(DebtorTransformer.toServer),
			issuedAt: IssuedAtFieldTransformer.toServer(formState.issuedAt)
		};
	}
}

function useBillForm() {
	return useForm<BillFormState>({
		resolver: zodResolver(BillFormStateSchema),
		defaultValues: {
			description: "",
			receiptFile: null,
			creditor: { userId: "", amount: "" },
			debtors: [{ amount: "", userId: "" }],
			issuedAt: formatDate(format(new Date(), SERVER_DATE_FORMAT)).client
		}
	});
}

function formatDate(date?: string | null) {
	const value = date ?? new Date();

	return { server: format(value, SERVER_DATE_FORMAT), client: format(value, CLIENT_DATE_FORMAT) };
}

export const BillForm: React.FC<BillForm.Props> = (props) => {
	const { kind } = props;
	const [editing, { setFalse: endEditing, setTrue: startEditing }] = useBoolean(() => kind.type === "create");

	const createBill = useCreateBill();
	const updateBill = useUpdateBill(endEditing);

	const { data: bill, isPending: loadingBill } = trpc.bills.get.useQuery(
		{ billId: kind.type === "update" ? kind.billId : "" },
		{ enabled: kind.type === "update" }
	);

	const loading = React.useMemo(() => kind.type === "update" && loadingBill, [kind.type, loadingBill]);

	const form = useBillForm();
	const { watch, reset, control, getValues, handleSubmit } = form;

	React.useEffect(() => {
		if (bill) {
			reset(BillFormStateTransformer.fromServer(bill));
		}
	}, [bill, reset, getValues]);

	watch("debtors");
	const { fields: debtors, append: appendDebtor, remove: removeDebtors } = useFieldArray({ control, name: "debtors" });

	const onSubmit = React.useMemo(() => {
		return handleSubmit((data) => {
			const bill = BillFormStateTransformer.toServer(data);

			if (kind.type === "create") {
				createBill(bill);
			} else if (kind.type === "update") {
				updateBill({ ...bill, id: kind.billId });
			} else {
				throw new Error("Invalid form type");
			}
		});
	}, [createBill, handleSubmit, kind, updateBill]);

	const { isPending: isPendingUsers } = trpc.groups.members.useQuery();

	return (
		<Form {...form}>
			<div className="flex flex-col gap-4">
				<BillFormHeading kind={kind} bill={bill} />
				<div className="grid grid-cols-10 gap-4">
					<div className="col-span-10">
						<div className="grid grid-cols-10 grid-rows-2 gap-4">
							<div className="col-span-5">
								<FormField
									control={control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<RequiredLabel>Description</RequiredLabel>
											<FormControl>
												<SkeletonWrapper loading={loading} skeleton={<Skeleton className="h-10 w-full" />}>
													<Input
														readOnly={!editing}
														placeholder="Enter bill description"
														className={editing ? "" : "pointer-events-none"}
														{...field}
													/>
												</SkeletonWrapper>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="col-span-3 row-span-2 flex items-center justify-center">
								<FormField
									control={control}
									name="receiptFile"
									render={({ field }) => (
										<FileUpload
											buttonSize="md"
											editing={editing}
											loading={loading}
											bucketName="receipts"
											onChange={field.onChange}
											fileId={field.value ?? undefined}
											imageRenderer={(src) => <ImageDialog src={src} />}
											ownerId={kind.type === "update" ? kind.billId : undefined}
										/>
									)}
								/>
							</div>
							<div className="col-span-5">
								<FormField
									name="issuedAt"
									control={control}
									render={({ field }) => (
										<FormItem>
											<RequiredLabel>Issued At</RequiredLabel>
											<FormControl>
												<SkeletonWrapper loading={loading} skeleton={<Skeleton className="h-10 w-full" />}>
													<Input readOnly={!editing} placeholder={CLIENT_DATE_FORMAT} className={editing ? "" : "pointer-events-none"} {...field} />
												</SkeletonWrapper>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					</div>

					<BillMemberInputs editing={editing} loading={loading} member={{ type: "creditor" }} />
					{debtors.map((debtor, debtorIndex) => {
						return (
							<BillMemberInputs
								key={debtor.id}
								editing={editing}
								loading={loading}
								member={{ debtorIndex, type: "debtor" }}
								onRemove={() => removeDebtors(debtorIndex)}
							/>
						);
					})}
				</div>

				<div className={`flex ${editing ? "justify-between" : "justify-end"}`}>
					{editing && (
						<Button size="sm" variant="outline" onClick={() => appendDebtor({ amount: "", userId: "" })}>
							<Plus />
							Add debtor
						</Button>
					)}
					{editing && (
						<div className="flex gap-4">
							{kind.type === "update" ? (
								<>
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											endEditing();
											reset();
										}}>
										<Ban /> Cancel
									</Button>
									<Button size="sm" onClick={onSubmit}>
										<Check /> Save
									</Button>
								</>
							) : (
								<Button size="sm" type="submit" onClick={onSubmit} disabled={isPendingUsers}>
									<Plus /> Create
								</Button>
							)}
						</div>
					)}
					{!editing && (
						<Button size="sm" variant="outline" onClick={startEditing}>
							<Pencil /> Edit
						</Button>
					)}
				</div>
			</div>
			{/*<DevTool control={control} />*/}
		</Form>
	);
};

function useCreateBill() {
	const router = useRouter();
	const utils = trpc.useUtils();

	const { mutate } = trpc.bills.create.useMutation({
		onError: () => {
			toast.error("Failed to create bill");
		},
		onSuccess: () => {
			toast.success("A new bill has been created and saved successfully.");

			utils.bills.getMany.invalidate().then(() => router.push("/bills"));
		}
	});

	return mutate;
}

function useUpdateBill(onSuccess: () => void) {
	const utils = trpc.useUtils();

	const { mutate } = trpc.bills.update.useMutation({
		onError: () => {
			toast.error("Failed to update bill");
		},
		onSuccess: () => {
			toast.success("The bill details have been updated successfully.");

			utils.bills.getMany.invalidate().then(onSuccess);
		}
	});

	return mutate;
}
