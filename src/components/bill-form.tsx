"use client";

import { z } from "zod";
import React from "react";
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
import { CLIENT_DATE_FORMAT } from "@/utils";
import { ReceiptUpload } from "@/components/receipt-upload";
import { SkeletonWrapper } from "@/components/skeleton-wrapper";
import { BillFormHeading } from "@/components/bill-form-heading";
import { type ClientBill, type ClientBillMember } from "@/schemas";
import { BillMemberInputs } from "@/components/bill-member-inputs";
import { IssuedAtField, IssuedAtFieldTransformer, OptionalAmountFieldSchema, OptionalAmountFieldTransformer } from "@/schemas/form.schema";

export namespace BillForm {
	export type Kind = { readonly type: "create" } | { readonly type: "update"; readonly billId: string };

	export interface Props {
		readonly kind: Kind;
	}
}

export const BillFormMemberSchema = z.object({ userId: z.string(), amount: OptionalAmountFieldSchema });
export type BillFormMember = z.infer<typeof BillFormMemberSchema>;
export namespace BillFormMemberTransformer {
	export function toServer(member: BillFormMember) {
		return { ...member, amount: OptionalAmountFieldTransformer.toServer(member.amount) };
	}

	export function fromServer(member: ClientBillMember): BillFormMember {
		return { ...member, amount: OptionalAmountFieldTransformer.fromServer(member.amount) };
	}
}

export const BillFormStateSchema = API.Bills.UpsertBillSchema.extend({
	issuedAt: IssuedAtField,
	creditor: BillFormMemberSchema,
	debtors: z.array(BillFormMemberSchema)
});

export type BillFormState = z.infer<typeof BillFormStateSchema>;
namespace BillFormStateTransformer {
	export function fromServer(bill: ClientBill): BillFormState {
		return {
			...bill,
			issuedAt: IssuedAtFieldTransformer.fromServer(bill.issuedAt),
			creditor: BillFormMemberTransformer.fromServer(bill.creditor),
			debtors: bill.debtors.map(BillFormMemberTransformer.fromServer)
		};
	}

	export function toServer(formState: BillFormState): API.Bills.UpsertBill {
		return {
			...formState,
			issuedAt: IssuedAtFieldTransformer.toServer(formState.issuedAt),
			creditor: BillFormMemberTransformer.toServer(formState.creditor),
			debtors: formState.debtors.map(BillFormMemberTransformer.toServer)
		};
	}
}

function useBillForm() {
	return useForm<BillFormState>({
		resolver: zodResolver(BillFormStateSchema),
		defaultValues: { receiptFile: null, debtors: [{ amount: "", userId: "" }] }
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

	return (
		<FormProvider {...methods}>
			<Stack gap="{spacing.4}">
				<BillFormHeading kind={kind} bill={bill} />
				<SimpleGrid columns={10} gap="{spacing.4}">
					<GridItem colSpan={{ base: 10 }}>
						<SimpleGrid templateRows="repeat(2, 1fr)" templateColumns="repeat(10, 1fr)">
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
								<Button type="submit" variant="solid" onClick={onSubmit}>
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
			onSuccess();
		}
	});

	return mutate;
}
