"use client";

import React from "react";
import { format } from "date-fns";
import { DevTool } from "@hookform/devtools";
import { IoIosAddCircle } from "react-icons/io";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdEdit, MdCheck, MdCancel } from "react-icons/md";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { Text, Input, Stack, HStack, Heading, GridItem, SimpleGrid } from "@chakra-ui/react";

import { API } from "@/api";
import { Field } from "@/chakra/field";
import { Button } from "@/chakra/button";
import { toaster } from "@/chakra/toaster";
import { ReceiptUpload } from "@/components/receipt-upload";
import { type ErrorState, type BillFormState } from "@/types";
import { BillMemberInputs } from "@/components/bill-member-inputs";
import { formatDate, formatTime, CLIENT_DATE_FORMAT, formatDistanceTime, SERVER_DATE_FORMAT } from "@/utils";
import { type NewFormState, BillFormStateSchema, DateFieldTransformer, BillFormMemberSchemaTransformer } from "@/schemas/form.schema";

namespace BillForm {
	export interface Props {
		readonly newKind: { readonly type: "create" } | { readonly type: "update"; readonly billId: string };
	}
}

export interface MemberState {
	readonly user: ErrorState & { readonly userId: string | undefined };
	readonly amount: ErrorState & { readonly input: string; readonly value?: number };
}
namespace MemberState {
	export function fromBillMemberState(memberState: BillFormState["creditor"]): MemberState {
		const { userId, amount } = memberState;

		return {
			user: { userId, error: userId === undefined ? "This field is required" : undefined },
			amount: { value: amount, error: undefined, input: amount === undefined ? "" : String(amount) }
		};
	}

	export function select(state: FormState, memberKind: MemberKind): MemberState {
		if (memberKind.memberKind === "creditor") {
			return state.creditor;
		}

		if (memberKind.memberKind === "debtor") {
			return state.debtors[memberKind.debtorIndex];
		}

		// @ts-expect-error Invalid member kind
		throw new Error(`Unhandled member kind: ${memberKind.memberKind}`);
	}
}

type MemberKind = { readonly memberKind: "creditor" } | { readonly debtorIndex: number; readonly memberKind: "debtor" };

interface FormState {
	readonly creditor: MemberState;
	readonly debtors: readonly MemberState[];
	readonly receiptFile: string | undefined;
	readonly description: ErrorState & { readonly value: string };
	readonly issuedAt: ErrorState & {
		readonly input: string;
		readonly value: string | null;
	};
}

const REQUIRED_MESSAGE = "This field is required";

namespace FormState {
	export function create(formState: BillFormState): FormState {
		const { description, receiptFile } = formState;
		const issuedAt = formState.issuedAt ?? format(new Date(), SERVER_DATE_FORMAT);

		const debtors = formState.debtors.map(MemberState.fromBillMemberState);

		return {
			debtors,
			receiptFile: receiptFile ?? undefined,
			creditor: MemberState.fromBillMemberState(formState.creditor),
			issuedAt: { value: issuedAt, error: undefined, input: formatDate(issuedAt).client },
			description: { value: description, error: description ? undefined : REQUIRED_MESSAGE }
		};
	}
}

export const BillForm: React.FC<BillForm.Props> = (props) => {
	const { newKind } = props;
	const [editing, setEditing] = React.useState(() => newKind.type === "create");

	const { mutate: updateBill } = useMutation({
		mutationFn: (payload: API.Bills.Update.Payload) => {
			return API.Bills.Update.mutate(payload);
		},
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
			// 			setEditing(() => false);
		}
	});

	const { mutate: createBill } = useMutation({
		mutationFn: (payload: API.Bills.Create.Body) => {
			return API.Bills.Create.mutate(payload);
		},
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

			// router.push("/bills");
		}
	});

	const { data: currentBill, isSuccess: isSuccessLoadBill } = useQuery({
		queryKey: ["bills", newKind],
		enabled: newKind.type === "update",
		queryFn: () => API.Bills.Get.query({ billId: newKind.type === "update" ? newKind.billId : "" })
	});

	const methods = useForm<NewFormState>({
		resolver: zodResolver(BillFormStateSchema),
		defaultValues:
			newKind.type === "create"
				? {
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
			const transformedData = {
				...data,
				receiptFile: null,
				issuedAt: DateFieldTransformer.toServer(data.issuedAt),
				creditor: BillFormMemberSchemaTransformer.toServer(data.creditor),
				debtors: data.debtors.map(BillFormMemberSchemaTransformer.toServer)
			};

			if (newKind.type === "create") {
				createBill(transformedData);
			} else if (newKind.type === "update") {
				updateBill({ body: transformedData, billId: newKind.billId });
			} else {
				throw new Error("Invalid form type");
			}
		});
	}, [handleSubmit, newKind, createBill, updateBill]);

	return (
		<>
			<FormProvider {...methods}>
				<Stack gap="{spacing.4}">
					<Stack gap={0}>
						<Heading>{newKind.type === "update" ? "Bill Details" : "New Bill"}</Heading>
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
									<ReceiptUpload editing={editing} billId={newKind.type === "update" ? newKind.billId : undefined} />
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
								{newKind.type === "update" && (
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
								{newKind.type === "create" && (
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
