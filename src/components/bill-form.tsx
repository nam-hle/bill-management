"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DevTool } from "@hookform/devtools";
import { IoIosAddCircle } from "react-icons/io";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdEdit, MdCheck, MdCancel } from "react-icons/md";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Text, Input, Stack, HStack, Heading, GridItem, SimpleGrid } from "@chakra-ui/react";

import { API } from "@/api";
import { Field } from "@/chakra/field";
import { Button } from "@/chakra/button";
import { toaster } from "@/chakra/toaster";
import { ReceiptUpload } from "@/components/receipt-upload";
import { BillMemberInputs } from "@/components/bill-member-inputs";
import { formatTime, CLIENT_DATE_FORMAT, formatDistanceTime } from "@/utils";
import { type NewFormState, BillFormStateSchema, DateFieldTransformer, BillFormMemberSchemaTransformer } from "@/schemas/form.schema";

namespace BillForm {
	export interface Props {
		readonly kind: { readonly type: "create" } | { readonly type: "update"; readonly billId: string };
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

export const BillForm: React.FC<BillForm.Props> = (props) => {
	const { kind } = props;
	const [editing, setEditing] = React.useState(() => kind.type === "create");

	const createBill = useCreateBill();
	const updateBill = useUpdateBill(() => setEditing(() => false));

	const { data: currentBill, isSuccess: isSuccessLoadBill } = useQuery({
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
	const {
		reset,
		control,
		register,
		handleSubmit,
		formState: { errors }
	} = methods;

	React.useEffect(() => {
		if (currentBill) {
			reset({
				...currentBill,
				creditor: BillFormMemberSchemaTransformer.fromServer(currentBill.creditor),
				issuedAt: DateFieldTransformer.fromServer(currentBill.issuedAt ?? undefined),
				debtors: currentBill.debtors.map(BillFormMemberSchemaTransformer.fromServer)
			});
		}
	}, [currentBill, reset]);

	const { fields: debtorFields, append: appendDebtor } = useFieldArray({ control, name: "debtors" });

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
		<>
			<FormProvider {...methods}>
				<Stack gap="{spacing.4}">
					<Stack gap={0}>
						<Heading>{kind.type === "update" ? "Bill Details" : "New Bill"}</Heading>
						{isSuccessLoadBill && (
							<Text color="grey" textStyle="xs" fontStyle="italic">
								Created <span title={formatTime(currentBill.creator.timestamp)}>{formatDistanceTime(currentBill.creator.timestamp)}</span> by{" "}
								{currentBill.creator.fullName}
								{currentBill.updater?.timestamp && (
									<>
										{" "}
										• Last updated{" "}
										<span title={formatTime(currentBill.updater?.timestamp)}>{formatDistanceTime(currentBill.updater?.timestamp)}</span> by{" "}
										{currentBill.updater?.fullName ?? "someone"}
									</>
								)}
							</Text>
						)}
					</Stack>
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
						{debtorFields.map((_, debtorIndex) => {
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
												setEditing(() => false);
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
							<Button variant="solid" onClick={() => setEditing(() => true)}>
								<MdEdit /> Edit
							</Button>
						)}
					</HStack>
				</Stack>
			</FormProvider>
			<DevTool control={control} />
		</>
	);
};
