"use client";

import { z } from "zod";
import React from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ban, Plus, Check, Pencil } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Form, FormItem, FormField, FormControl, FormMessage } from "@/components/shadcn/form";

import { FileUpload } from "@/components/file-upload";
import { ImageModal } from "@/components/image-modal";
import { BillMemberInputs } from "@/components/inputs";
import { RequiredLabel } from "@/components/required-label";
import { SkeletonWrapper } from "@/components/skeleton-wrapper";
import { BillFormHeading } from "@/components/bill-form-heading";

import { API } from "@/api";
import { useBoolean } from "@/hooks";
import { useToast } from "@/hooks/use-toast";
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
		return { ...member, amount: RequiredAmountFieldTransformer.fromServer(member.amount) };
	}
}

const DebtorSchema = z.object({ amount: OptionalAmountFieldSchema, userId: z.string().min(1, "Debtor is required") });
export namespace DebtorTransformer {
	export function toServer(member: z.infer<typeof DebtorSchema>) {
		return { ...member, amount: OptionalAmountFieldTransformer.toServer(member.amount) };
	}

	export function fromServer(member: ClientBillMember): z.infer<typeof DebtorSchema> {
		return { ...member, amount: OptionalAmountFieldTransformer.fromServer(member.amount) };
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

	const { data: bill, isPending: loadingBill } = useQuery<ClientBill>({
		queryKey: ["bill", kind],
		enabled: kind.type === "update",
		queryFn: () => API.Bills.Get.query({ billId: kind.type === "update" ? kind.billId : "" })
	});

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
				createBill({ bill });
			} else if (kind.type === "update") {
				updateBill({ bill, id: kind.billId });
			} else {
				throw new Error("Invalid form type");
			}
		});
	}, [createBill, handleSubmit, kind, updateBill]);

	const { isPending: isPendingUsers } = useQuery({ queryKey: ["users"], queryFn: API.Users.List.query });

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
											imageRenderer={(src) => <ImageModal src={src} />}
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
						<Button size="sm" variant="secondary" onClick={() => appendDebtor({ amount: "", userId: "" })}>
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
										variant="secondary"
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
						<Button size="sm" onClick={startEditing}>
							<Pencil /> Edit
						</Button>
					)}
				</div>
			</div>
			<DevTool control={control} />
		</Form>
	);
};

function useCreateBill() {
	const queryClient = useQueryClient();
	const router = useRouter();

	const { toast } = useToast();
	const { mutate } = useMutation({
		mutationFn: API.Bills.Create.mutate,
		onError: () => {
			toast({
				variant: "destructive",
				title: "Failed to create bill",
				description: "An error occurred while creating the bill. Please try again."
			});
		},
		onSuccess: () => {
			toast({
				title: "Bill created successfully",
				description: "A new bill has been created and saved successfully."
			});

			queryClient.invalidateQueries({ queryKey: ["bills"] }).then(() => router.push("/bills"));
		}
	});

	return mutate;
}

function useUpdateBill(onSuccess: () => void) {
	const queryClient = useQueryClient();

	const { toast } = useToast();
	const { mutate } = useMutation({
		mutationFn: API.Bills.Update.mutate,
		onError: () => {
			toast({
				variant: "destructive",
				title: "Failed to update bill",
				description: "Unable to update the bill. Please verify your input and retry."
			});
		},
		onSuccess: () => {
			toast({
				title: "Bill updated successfully",
				description: "The bill details have been updated successfully."
			});

			queryClient.invalidateQueries({ queryKey: ["bills"] }).then(onSuccess);
		}
	});

	return mutate;
}
