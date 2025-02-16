"use client";

import { z } from "zod";
import React from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdEdit, MdCheck, MdCancel } from "react-icons/md";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input, Stack, HStack, GridItem, SimpleGrid } from "@chakra-ui/react";
import { useForm, Controller, FormProvider, useFieldArray } from "react-hook-form";

import { API } from "@/api";
import { useBoolean } from "@/hooks";
import { Field } from "@/chakra/field";
import { Button } from "@/chakra/button";
import { toaster } from "@/chakra/toaster";
import { Skeleton } from "@/chakra/skeleton";
import { SkeletonWrapper } from "@/components/skeleton-wrapper";
import { BillFormHeading } from "@/components/bill-form-heading";
import { type ClientBill, type ClientBillMember } from "@/schemas";
import { ReceiptUpload, BillMemberInputs } from "@/components/inputs";
import { formatDate, CLIENT_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/utils";
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

export const BillFormStateSchema = API.Bills.UpsertBillSchema.extend({
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
			receiptFile: null,
			creditor: { userId: "", amount: "" },
			debtors: [{ amount: "", userId: "" }],
			issuedAt: formatDate(format(new Date(), SERVER_DATE_FORMAT)).client
		}
	});
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

	const methods = useBillForm();
	const { watch, reset, control, register, getValues, formState, handleSubmit } = methods;
	const { errors } = formState;

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
		<FormProvider {...methods}>
			<Stack className="ck" gap="{spacing.4}">
				<BillFormHeading kind={kind} bill={bill} />
				<SimpleGrid columns={10} gap="{spacing.4}">
					<GridItem colSpan={{ base: 10 }}>
						<SimpleGrid gap="{spacing.4}" templateRows="repeat(2, 1fr)" templateColumns="repeat(10, 1fr)">
							<GridItem colSpan={5}>
								<Field required label="Description" invalid={!!errors.description} errorText={errors.description?.message}>
									<SkeletonWrapper loading={loading} skeleton={<Skeleton width="100%" height="40px" />}>
										<Input
											{...register("description")}
											readOnly={!editing}
											placeholder="Enter bill description"
											pointerEvents={editing ? undefined : "none"}
										/>
									</SkeletonWrapper>
								</Field>
							</GridItem>
							<GridItem rowSpan={2} colSpan={3}>
								<Controller
									control={control}
									name="receiptFile"
									render={({ field }) => (
										<ReceiptUpload
											loading={loading}
											editing={editing}
											onChange={field.onChange}
											fileId={field.value ?? undefined}
											ownerId={kind.type === "update" ? kind.billId : undefined}
										/>
									)}
								/>
							</GridItem>
							<GridItem colSpan={5}>
								<Field required label="Issued at" invalid={!!errors.issuedAt} errorText={errors.issuedAt?.message}>
									<SkeletonWrapper loading={loading} skeleton={<Skeleton width="100%" height="40px" />}>
										<Input
											{...register("issuedAt")}
											readOnly={!editing}
											placeholder={CLIENT_DATE_FORMAT}
											pointerEvents={editing ? undefined : "none"}
										/>
									</SkeletonWrapper>
								</Field>
							</GridItem>
						</SimpleGrid>
					</GridItem>

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
				</SimpleGrid>

				<HStack justifyContent={editing ? "space-between" : "flex-end"}>
					{editing && (
						<Button variant="subtle" onClick={() => appendDebtor({ amount: "", userId: "" })}>
							Add debtor
						</Button>
					)}
					{editing && (
						<HStack>
							{kind.type === "update" ? (
								<>
									<Button
										variant="subtle"
										onClick={() => {
											endEditing();
											reset();
										}}>
										<MdCancel /> Cancel
									</Button>
									<Button variant="solid" onClick={onSubmit}>
										<MdCheck /> Done
									</Button>
								</>
							) : (
								<Button type="submit" variant="solid" onClick={onSubmit} disabled={isPendingUsers}>
									<IoIosAddCircle /> Create
								</Button>
							)}
						</HStack>
					)}
					{!editing && (
						<Button variant="solid" onClick={startEditing}>
							<MdEdit /> Edit
						</Button>
					)}
				</HStack>
			</Stack>
		</FormProvider>
	);
};

function useCreateBill() {
	const queryClient = useQueryClient();
	const router = useRouter();

	const { mutate } = useMutation({
		mutationFn: API.Bills.Create.mutate,
		onError: () => {
			toaster.create({
				type: "error",
				title: "Failed to create bill",
				description: "An error occurred while creating the bill. Please try again."
			});
		},
		onSuccess: () => {
			toaster.create({
				type: "success",
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

	const { mutate } = useMutation({
		mutationFn: API.Bills.Update.mutate,
		onError: () => {
			toaster.create({
				type: "error",
				title: "Failed to update bill",
				description: "Unable to update the bill. Please verify your input and retry."
			});
		},
		onSuccess: () => {
			toaster.create({
				type: "success",
				title: "Bill updated successfully",
				description: "The bill details have been updated successfully."
			});

			queryClient.invalidateQueries({ queryKey: ["bills"] }).then(onSuccess);
		}
	});

	return mutate;
}
