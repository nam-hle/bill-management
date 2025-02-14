"use client";

import React from "react";
import { format } from "date-fns";
import { DevTool } from "@hookform/devtools";
import { IoIosAddCircle } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdEdit, MdDeleteOutline } from "react-icons/md";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { Text, Input, Stack, HStack, Heading, GridItem, SimpleGrid } from "@chakra-ui/react";

import { API } from "@/api";
import { Field } from "@/chakra/field";
import { Button } from "@/chakra/button";
import { toaster } from "@/chakra/toaster";
import { type ClientUser } from "@/schemas";
import { BillMemberInputs } from "@/components/bill-member-inputs";
import { FormKind, type ErrorState, type BillFormState } from "@/types";
import { formatDate, formatTime, CLIENT_DATE_FORMAT, formatDistanceTime, SERVER_DATE_FORMAT } from "@/utils";
import { type NewFormState, BillFormStateSchema, DateFieldTransformer, BillFormMemberSchemaTransformer } from "@/schemas/form.schema";

namespace BillForm {
	export interface Props {
		readonly kind: FormKind;
		readonly formState: BillFormState;
		readonly users: readonly ClientUser[];
		readonly newKind:
			| {
					readonly type: "create";
			  }
			| {
					readonly type: "update";
					readonly bill: BillFormState;
			  };
		readonly metadata: {
			readonly id?: string;
			readonly creator?: { readonly userId: string; readonly timestamp: string; readonly fullName: string | null };
			readonly updater?: { readonly userId: string; readonly timestamp: string; readonly fullName: string | null };
		};
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
	const { kind, users, newKind, metadata } = props;
	const [editing, setEditing] = React.useState(() => newKind.type === "create");

	// const errors = React.useMemo(
	// 	() => [
	// 		formState.description.error,
	// 		formState.issuedAt.error,
	// 		formState.creditor.amount.error,
	// 		...formState.debtors.map((debtor) => debtor.amount.error),
	// 		...formState.debtors.map((debtor) => debtor.user.error)
	// 	],
	// 	[formState.creditor.amount.error, formState.debtors, formState.description.error, formState.issuedAt.error]
	// );

	// const hasError = React.useMemo(() => {
	// 	return errors.filter((e) => e !== undefined).length > 0;
	// }, [errors]);

	// const router = useRouter();
	// const onSubmit = React.useCallback(async () => {
	// 	if (kind === FormKind.CREATE) {
	// 		await fetch("/api/bills", {
	// 			method: "POST",
	// 			body: JSON.stringify(FormState.toPayload(formState)),
	// 			headers: {
	// 				"Content-Type": "application/json"
	// 			}
	// 		}).then((response) => {
	// 			if (response.ok) {
	// 				router.push("/bills");
	//
	// 				toaster.create({
	// 					type: "success",
	// 					title: "Bill created successfully",
	// 					description: "A new bill has been created and saved successfully."
	// 				});
	// 			} else {
	// 				toaster.create({
	// 					type: "error",
	// 					title: "Failed to create bill",
	// 					description: "An error occurred while creating the bill. Please try again."
	// 				});
	// 			}
	// 		});
	//
	// 		return;
	// 	}
	//
	// 	// if (kind === FormKind.UPDATE) {
	// 	// 	if (!metadata.id) {
	// 	// 		toaster.create({
	// 	// 			type: "error",
	// 	// 			title: "Invalid bill ID",
	// 	// 			description: "The bill ID is invalid. Please try again."
	// 	// 		});
	// 	//
	// 	// 		return;
	// 	// 	}
	// 	//
	// 	// 	await fetch(`/api/bills/${metadata.id}`, {
	// 	// 		method: "PUT",
	// 	// 		headers: { "Content-Type": "application/json" },
	// 	// 		body: JSON.stringify(FormState.toPayload(formState))
	// 	// 	}).then((response) => {
	// 	// 		if (response.ok) {
	// 	// 			toaster.create({
	// 	// 				type: "success",
	// 	// 				title: "Bill updated successfully",
	// 	// 				description: "The bill details have been updated successfully."
	// 	// 			});
	// 	// 			setEditing(() => false);
	// 	// 		} else {
	// 	// 			toaster.create({
	// 	// 				type: "error",
	// 	// 				title: "Failed to update bill",
	// 	// 				description: "Unable to update the bill. Please verify your input and retry."
	// 	// 			});
	// 	// 		}
	// 	// 	});
	// 	// }
	// }, [formState, kind, metadata.id, router]);

	const { mutate } = useMutation({
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
				: {
						description: newKind.bill.description,
						creditor: BillFormMemberSchemaTransformer.fromServer({
							userId: newKind.bill.creditor.userId as string,
							amount: newKind.bill.creditor.amount as number
						}),
						debtors: newKind.bill.debtors.map((debtor) => {
							return BillFormMemberSchemaTransformer.fromServer({ userId: debtor.userId as string, amount: debtor.amount as number });
						})
					}
	});
	const {
		control,
		register,
		handleSubmit,
		formState: { errors }
	} = methods;

	const { fields: debtorFields, remove: removeDebtor, append: appendDebtor } = useFieldArray({ control, name: "debtors" });

	const onSubmit = React.useMemo(() => {
		return handleSubmit((data) => {
			mutate({
				...data,
				receiptFile: null,
				issuedAt: DateFieldTransformer.toServer(data.issuedAt),
				creditor: BillFormMemberSchemaTransformer.toServer(data.creditor),
				debtors: data.debtors.map(BillFormMemberSchemaTransformer.toServer)
			});
		});
	}, [handleSubmit, mutate]);

	return (
		<>
			<FormProvider {...methods}>
				<Stack gap="{spacing.4}">
					<Stack gap={0}>
						<Heading>{kind === FormKind.UPDATE ? "Bill Details" : "New Bill"}</Heading>
						{kind === FormKind.UPDATE && (
							<Text color="grey" textStyle="xs" fontStyle="italic">
								Created <span title={formatTime(metadata.creator?.timestamp)}>{formatDistanceTime(metadata.creator?.timestamp)}</span> by{" "}
								{metadata.creator?.fullName ?? "someone"}
								{metadata.updater?.timestamp && (
									<>
										{" "}
										• Last updated <span title={formatTime(metadata.updater?.timestamp)}>
											{formatDistanceTime(metadata.updater?.timestamp)}
										</span> by {metadata.updater?.fullName ?? "someone"}
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
								{/*<GridItem rowSpan={2} colSpan={3}>*/}
								{/*	<ReceiptUpload*/}
								{/*		editing={editing}*/}
								{/*		receiptFile={formState.receiptFile}*/}
								{/*		onReceiptChange={(receiptFileName) => dispatch({ type: "changeReceipt", payload: { receiptFileName } })}*/}
								{/*	/>*/}
								{/*</GridItem>*/}
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

						<BillMemberInputs label="Creditor" readonly={!editing} amountLabel="Total Amount" coordinate={{ type: "creditor" }} />
						{debtorFields.map((debtor, debtorIndex) => {
							return (
								<BillMemberInputs
									// users={users.filter((user) => user.id === debtor.userId || !getValues("debtors").some((d) => d.userId === user.id))}
									key={debtorIndex}
									readonly={!editing}
									label={`Debtor ${debtorIndex + 1}`}
									coordinate={{ debtorIndex, type: "debtor" }}
									amountLabel={`Split Amount ${debtorIndex + 1}`}
									action={
										editing && (
											<Button variant="subtle" colorPalette="red" onClick={() => removeDebtor(debtorIndex)}>
												<MdDeleteOutline /> Delete
											</Button>
										)
									}
								/>
							);
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
								{/*{kind === FormKind.UPDATE && (*/}
								{/*	<>*/}
								{/*		<Button*/}
								{/*			variant="subtle"*/}
								{/*			onClick={() => {*/}
								{/*				setEditing(() => false);*/}
								{/*				dispatch({ type: "reset", payload: props.formState });*/}
								{/*			}}>*/}
								{/*			<MdCancel /> Cancel*/}
								{/*		</Button>*/}
								{/*		<Button variant="solid" onClick={onSubmit} disabled={hasError}>*/}
								{/*			<MdCheck /> Done*/}
								{/*		</Button>*/}
								{/*	</>*/}
								{/*)}*/}
								{kind === FormKind.CREATE && (
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
