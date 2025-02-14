"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdEdit, MdCheck, MdCancel } from "react-icons/md";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Text, Input, Stack, HStack, Heading, GridItem, SimpleGrid } from "@chakra-ui/react";

import { API } from "@/api";
import { useBoolean } from "@/hooks";
import { Field } from "@/chakra/field";
import { Button } from "@/chakra/button";
import { toaster } from "@/chakra/toaster";
import { type ClientBill } from "@/schemas";
import { ReceiptUpload } from "@/components/receipt-upload";
import { BillMemberInputs } from "@/components/bill-member-inputs";
import { formatTime, CLIENT_DATE_FORMAT, formatDistanceTime } from "@/utils";
import { type NewFormState, BillFormStateSchema, DateFieldTransformer, BillFormMemberSchemaTransformer } from "@/schemas/form.schema";

namespace BillForm {
	export type Kind = { readonly type: "create" } | { readonly type: "update"; readonly billId: string };

	export interface Props {
		readonly kind: Kind;
	}
}

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

namespace FormHeading {
	export interface Props extends BillForm.Props {
		readonly currentBill: ClientBill | undefined;
	}
}

const FormHeading = ({ kind, currentBill }: FormHeading.Props) => {
	return (
		<Stack gap={0}>
			<Heading>{kind.type === "update" ? "Bill Details" : "New Bill"}</Heading>
			{currentBill && (
				<Text color="grey" textStyle="xs" fontStyle="italic">
					Created <span title={formatTime(currentBill.creator.timestamp)}>{formatDistanceTime(currentBill.creator.timestamp)}</span> by{" "}
					{currentBill.creator.fullName}
					{currentBill.updater?.timestamp && (
						<>
							{" "}
							• Last updated <span title={formatTime(currentBill.updater?.timestamp)}>
								{formatDistanceTime(currentBill.updater?.timestamp)}
							</span> by {currentBill.updater?.fullName ?? "someone"}
						</>
					)}
				</Text>
			)}
		</Stack>
	);
};

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

	const methods = useForm<NewFormState>({
		resolver: zodResolver(BillFormStateSchema),
		defaultValues:
			kind.type === "create"
				? {
						receiptFile: null,
						debtors: [
							{ userId: "", amount: "" },
							{ userId: "", amount: "" }
						]
					}
				: undefined
	});
	const { reset, control, register, formState, handleSubmit } = methods;
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
	}, [bill, reset]);

	const { fields: debtors, append: appendDebtor } = useFieldArray({ control, name: "debtors" });

	const onSubmit = React.useMemo(() => {
		return handleSubmit((data) => {
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
		});
	}, [handleSubmit, kind, createBill, updateBill]);

	return (
		<FormProvider {...methods}>
			<Stack gap="{spacing.4}">
				<FormHeading kind={kind} currentBill={bill} />
				<SimpleGrid columns={10} gap="{spacing.4}">
					<GridItem colSpan={{ base: 10 }}>
						<SimpleGrid templateRows="repeat(2, 1fr)" templateColumns="repeat(10, 1fr)">
							<GridItem colSpan={5}>
								<Field required label="Description" invalid={!!errors.description} errorText={errors.description?.message}>
									<Input
										{...register("description")}
										readOnly={!editing}
										placeholder="Enter bill description"
										pointerEvents={editing ? undefined : "none"}
									/>
								</Field>
							</GridItem>
							<GridItem rowSpan={2} colSpan={3}>
								<ReceiptUpload editing={editing} billId={kind.type === "update" ? kind.billId : undefined} />
							</GridItem>
							<GridItem colSpan={5}>
								<Field required label="Issued at" invalid={!!errors.issuedAt} errorText={errors.issuedAt?.message}>
									<Input
										{...register("issuedAt")}
										readOnly={!editing}
										placeholder={CLIENT_DATE_FORMAT}
										pointerEvents={editing ? undefined : "none"}
									/>
								</Field>
							</GridItem>
						</SimpleGrid>
					</GridItem>

					<BillMemberInputs editing={editing} coordinate={{ type: "creditor" }} />
					{debtors.map((_, debtorIndex) => {
						return <BillMemberInputs key={debtorIndex} editing={editing} coordinate={{ debtorIndex, type: "debtor" }} />;
					})}
				</SimpleGrid>

				<HStack justifyContent="flex-start">
					{editing && (
						<Button variant="subtle" onClick={() => appendDebtor({ amount: "", userId: "" })}>
							Add debtor
						</Button>
					)}
					{editing && (
						<HStack>
							{kind.type === "update" && (
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
							)}
							{kind.type === "create" && (
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
