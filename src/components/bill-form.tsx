"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdEdit, MdCheck, MdCancel } from "react-icons/md";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller, FormProvider, useFieldArray } from "react-hook-form";
import { Text, Input, Stack, HStack, Heading, GridItem, SimpleGrid } from "@chakra-ui/react";

import { API } from "@/api";
import { useBoolean } from "@/hooks";
import { Field } from "@/chakra/field";
import { Button } from "@/chakra/button";
import { toaster } from "@/chakra/toaster";
import { type ClientBill } from "@/schemas";
import { Skeleton, SkeletonText } from "@/chakra/skeleton";
import { ReceiptUpload } from "@/components/receipt-upload";
import { SkeletonWrapper } from "@/components/skeleton-wrapper";
import { BillMemberInputs } from "@/components/bill-member-inputs";
import { formatTime, CLIENT_DATE_FORMAT, formatDistanceTime } from "@/utils";
import { type NewFormState, BillFormStateSchema, DateFieldTransformer, BillFormMemberSchemaTransformer } from "@/schemas/form.schema";

namespace BillForm {
	export type Kind = { readonly type: "create" } | { readonly type: "update"; readonly billId: string };

	export interface Props {
		readonly kind: Kind;
	}
}

namespace FormHeading {
	export interface Props extends BillForm.Props {
		readonly currentBill: ClientBill | undefined;
	}
}

const FormHeading: React.FC<FormHeading.Props> = (props) => {
	const { kind, currentBill } = props;

	return (
		<Stack gap={0}>
			<Heading>{kind.type === "update" ? "Bill Details" : "New Bill"}</Heading>
			{kind.type === "create" ? null : (
				<SkeletonWrapper loading={!currentBill} skeleton={<SkeletonText gap="4" width="md" noOfLines={1} />}>
					{currentBill && (
						<Text color="grey" textStyle="xs" fontStyle="italic">
							Created <span title={formatTime(currentBill.creator.timestamp)}>{formatDistanceTime(currentBill.creator.timestamp)}</span> by{" "}
							{currentBill.creator.fullName}
							{currentBill.updater?.timestamp && (
								<>
									{" "}
									• Last updated <span title={formatTime(currentBill.updater?.timestamp)}>
										{formatDistanceTime(currentBill.updater?.timestamp)}
									</span>{" "}
									by {currentBill.updater?.fullName ?? "someone"}
								</>
							)}
						</Text>
					)}
				</SkeletonWrapper>
			)}
		</Stack>
	);
};

function useBillForm() {
	return useForm<NewFormState>({
		resolver: zodResolver(BillFormStateSchema),
		defaultValues: { receiptFile: null, debtors: [{ amount: "", userId: "" }] }
	});
}

export const BillForm: React.FC<BillForm.Props> = (props) => {
	const { kind } = props;
	const [editing, { setFalse: endEditing, setTrue: startEditing }] = useBoolean(() => kind.type === "create");

	const createBill = useCreateBill();
	const updateBill = useUpdateBill(endEditing);

	const { data: bill } = useQuery<ClientBill>({
		queryKey: ["bill", kind],
		enabled: kind.type === "update",
		queryFn: () => API.Bills.Get.query({ billId: kind.type === "update" ? kind.billId : "" })
	});

	const methods = useBillForm();
	const { watch, reset, control, register, getValues, formState, handleSubmit } = methods;
	const { errors } = formState;

	React.useEffect(() => {
		if (bill) {
			reset({
				...bill,
				creditor: BillFormMemberSchemaTransformer.fromServer(bill.creditor),
				issuedAt: DateFieldTransformer.fromServer(bill.issuedAt ?? undefined),
				debtors: bill.debtors.map(BillFormMemberSchemaTransformer.fromServer)
			});
		}
	}, [bill, reset, getValues]);

	watch("debtors");
	const { fields: debtors, append: appendDebtor, remove: removeDebtors } = useFieldArray({ control, name: "debtors" });

	const onSubmit = React.useMemo(
		() =>
			handleSubmit((data) => {
				const transformedData: API.Bills.UpsertBill = {
					...data,
					issuedAt: DateFieldTransformer.toServer(data.issuedAt),
					creditor: BillFormMemberSchemaTransformer.toServer(data.creditor),
					debtors: data.debtors.map(BillFormMemberSchemaTransformer.toServer)
				};

				if (kind.type === "create") {
					createBill(transformedData);
				} else if (kind.type === "update") {
					updateBill({ billId: kind.billId, body: transformedData });
				} else {
					throw new Error("Invalid form type");
				}
			}),
		[createBill, handleSubmit, kind, updateBill]
	);

	const loadingBill = React.useMemo(() => kind.type === "update" && !bill, [bill, kind.type]);

	return (
		<FormProvider {...methods}>
			<Stack gap="{spacing.4}">
				<FormHeading kind={kind} currentBill={bill} />
				<SimpleGrid columns={10} gap="{spacing.4}">
					<GridItem colSpan={{ base: 10 }}>
						<SimpleGrid templateRows="repeat(2, 1fr)" templateColumns="repeat(10, 1fr)">
							<GridItem colSpan={5}>
								<Field required label="Description" invalid={!!errors.description} errorText={errors.description?.message}>
									<SkeletonWrapper loading={loadingBill} skeleton={<Skeleton width="100%" height="40px" />}>
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
									<SkeletonWrapper loading={loadingBill} skeleton={<Skeleton width="100%" height="40px" />}>
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

					<BillMemberInputs editing={editing} loading={loadingBill} coordinate={{ type: "creditor" }} />
					{debtors.map((debtor, debtorIndex) => {
						return (
							<BillMemberInputs
								key={debtor.id}
								editing={editing}
								loading={loadingBill}
								onRemove={() => removeDebtors(debtorIndex)}
								coordinate={{ debtorIndex, type: "debtor" }}
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
