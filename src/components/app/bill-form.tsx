"use client";

import React from "react";
import { sumBy } from "lodash";
import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";
import { parse, format, isValid } from "date-fns";
import { MdEdit, MdCheck, MdCancel, MdDeleteOutline } from "react-icons/md";
import { Text, Input, Stack, HStack, Heading, GridItem, SimpleGrid } from "@chakra-ui/react";

import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";
import { BillMemberInputs } from "@/components/app/bill-member-inputs";
import { formatDate, formatTime, CLIENT_DATE_FORMAT, formatDistanceTime, SERVER_DATE_FORMAT } from "@/utils";
import { FormKind, type ClientUser, type ErrorState, type BillFormState, type BillFormTransfer } from "@/types";

namespace BillForm {
	export interface Props {
		readonly kind: FormKind;
		readonly formState: BillFormState;
		readonly users: readonly ClientUser[];
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

	export function reduce(state: FormState, memberKind: MemberKind, memberState: MemberState): FormState {
		if (memberKind.memberKind === "creditor") {
			return { ...state, creditor: memberState };
		}

		if (memberKind.memberKind === "debtor") {
			return { ...state, debtors: state.debtors.map((debtor, index) => (index === memberKind.debtorIndex ? memberState : debtor)) };
		}

		// @ts-expect-error Invalid member kind
		throw new Error(`Unhandled member kind: ${memberKind.member}`);
	}
}

type MemberKind = { readonly memberKind: "creditor" } | { readonly debtorIndex: number; readonly memberKind: "debtor" };

interface FormState {
	readonly creditor: MemberState;
	readonly debtors: readonly MemberState[];
	readonly description: ErrorState & { readonly value: string };
	readonly issuedAt: ErrorState & {
		readonly input: string;
		readonly value: string | null;
	};
}

type Action =
	| { readonly payload: {}; readonly type: "addDebtor" }
	| { readonly payload: {}; readonly type: "submitIssuedAt" }
	| { readonly type: "reset"; readonly payload: BillFormState }
	| { readonly type: "changeIssuedAt"; readonly payload: { readonly issuedAt: string } }
	| { readonly type: "deleteDebtor"; readonly payload: { readonly debtorIndex: number } }
	| { readonly type: "changeDescription"; readonly payload: { readonly description: string } }
	| { readonly type: "changeUser"; readonly payload: MemberKind & { readonly userId: string } }
	| { readonly type: "changeAmount"; readonly payload: MemberKind & { readonly input: string } };

const REQUIRED_MESSAGE = "This field is required";

namespace FormState {
	export function create(formState: BillFormState): FormState {
		const { description } = formState;
		const issuedAt = formState.issuedAt ?? format(new Date(), SERVER_DATE_FORMAT);

		const debtors = formState.debtors.map(MemberState.fromBillMemberState);

		return {
			debtors,
			creditor: MemberState.fromBillMemberState(formState.creditor),
			issuedAt: { value: issuedAt, error: undefined, input: formatDate(issuedAt).client },
			description: { value: description, error: description ? undefined : REQUIRED_MESSAGE }
		};
	}

	export function toPayload(state: FormState): BillFormTransfer {
		const { debtors, issuedAt, creditor, description } = state;

		return {
			description: description.value,
			issuedAt: issuedAt.value ?? "",
			creditor: { userId: creditor.user.userId ?? "", amount: creditor.amount.value ?? 0 },
			debtors: debtors.map((debtor) => ({ userId: debtor.user.userId ?? "", amount: debtor.amount.value ?? 0 }))
		};
	}
}

const reducer = (state: FormState, action: Action): FormState => {
	const { type, payload } = action;

	if (type === "reset") {
		return FormState.create(payload);
	}

	if (type === "addDebtor") {
		return {
			...state,
			debtors: [...state.debtors, { amount: { input: "", error: undefined }, user: { userId: undefined, error: REQUIRED_MESSAGE } }]
		};
	}

	if (type === "deleteDebtor") {
		return { ...state, debtors: state.debtors.filter((_, index) => index !== payload.debtorIndex) };
	}

	if (type === "changeDescription") {
		return {
			...state,
			description: {
				value: payload.description,
				error: payload.description ? undefined : REQUIRED_MESSAGE
			}
		};
	}

	if (type === "changeIssuedAt") {
		const parsedDate = parse(payload.issuedAt, CLIENT_DATE_FORMAT, new Date());
		const isValidDate = isValid(parsedDate);

		return {
			...state,
			issuedAt: {
				input: payload.issuedAt,
				error: isValidDate ? undefined : `Invalid date format dd/mm/yy`,
				value: isValidDate ? format(parsedDate, SERVER_DATE_FORMAT) : null
			}
		};
	}

	if (type === "submitIssuedAt") {
		if (state.issuedAt.error) {
			return state;
		}

		return { ...state, issuedAt: { ...state.issuedAt, input: formatDate(state.issuedAt.value).client } };
	}

	if (type === "changeUser") {
		const { userId, ...memberKind } = payload;
		const memberState = MemberState.select(state, memberKind);
		const nextMemberState = { ...memberState, user: { ...memberState.user, userId, error: undefined } };

		return MemberState.reduce(state, memberKind, nextMemberState);
	}

	if (type === "changeAmount") {
		const { input, ...memberKind } = payload;
		const memberState = MemberState.select(state, memberKind);
		let nextState: FormState;

		if (input === "") {
			nextState = MemberState.reduce(state, memberKind, { ...memberState, amount: { value: 0, input: "0", error: undefined } });
		} else {
			if (!/^[\d.]+$/.test(input)) {
				return state;
			}

			const amount = parseInt(input.replace(/\./g, ""), 10);

			if (isNaN(amount)) {
				nextState = MemberState.reduce(state, memberKind, { ...memberState, amount: { input, error: "Amount must be a number" } });
			} else {
				nextState = MemberState.reduce(state, memberKind, {
					...memberState,
					amount: { value: amount, error: undefined, input: new Intl.NumberFormat("vi-VN").format(amount) }
				});
			}
		}

		const sumDebtors = sumBy(nextState.debtors, (debtor) => debtor.amount.value ?? 0);
		const creditorAmount = nextState.creditor.amount.value ?? 0;

		nextState = {
			...nextState,
			creditor: {
				...nextState.creditor,
				amount: {
					...nextState.creditor.amount,
					error: creditorAmount < sumDebtors ? "Creditor amount must be greater than or equal to sum of split amounts" : undefined
				}
			}
		};

		return nextState;
	}

	return state;
};

export function renderError(validating: boolean, error: string | undefined) {
	return {
		errorText: validating ? error : undefined,
		invalid: validating ? !!error : undefined
	};
}

export const BillForm: React.FC<BillForm.Props> = (props) => {
	const { kind, users, metadata } = props;
	const [formState, dispatch] = React.useReducer(reducer, FormState.create(props.formState));
	const [editing, setEditing] = React.useState(() => kind === FormKind.CREATE);
	const [validating, setValidating] = React.useState(() => kind === FormKind.UPDATE);

	const errors = React.useMemo(
		() => [
			formState.description.error,
			formState.issuedAt.error,
			formState.creditor.amount.error,
			...formState.debtors.map((debtor) => debtor.amount.error),
			...formState.debtors.map((debtor) => debtor.user.error)
		],
		[formState.creditor.amount.error, formState.debtors, formState.description.error, formState.issuedAt.error]
	);

	const hasError = React.useMemo(() => {
		return errors.filter((e) => e !== undefined).length > 0;
	}, [errors]);

	const router = useRouter();
	const onSubmit = React.useCallback(async () => {
		if (kind === FormKind.CREATE) {
			await fetch("/api/bills", {
				method: "POST",
				body: JSON.stringify(FormState.toPayload(formState)),
				headers: {
					"Content-Type": "application/json"
				}
			}).then((response) => {
				if (response.ok) {
					router.push("/bills");

					toaster.create({
						type: "success",
						title: "Bill created successfully",
						description: "A new bill has been created and saved successfully."
					});
				} else {
					toaster.create({
						type: "error",
						title: "Failed to create bill",
						description: "An error occurred while creating the bill. Please try again."
					});
				}
			});

			return;
		}

		if (kind === FormKind.UPDATE) {
			if (!metadata.id) {
				toaster.create({
					type: "error",
					title: "Invalid bill ID",
					description: "The bill ID is invalid. Please try again."
				});

				return;
			}

			await fetch(`/api/bills/${metadata.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(FormState.toPayload(formState))
			}).then((response) => {
				if (response.ok) {
					toaster.create({
						type: "success",
						title: "Bill updated successfully",
						description: "The bill details have been updated successfully."
					});
					setEditing(() => false);
				} else {
					toaster.create({
						type: "error",
						title: "Failed to update bill",
						description: "Unable to update the bill. Please verify your input and retry."
					});
				}
			});
		}
	}, [formState, kind, metadata.id, router]);

	return (
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
								• Last updated <span title={formatTime(metadata.updater?.timestamp)}>{formatDistanceTime(metadata.updater?.timestamp)}</span> by{" "}
								{metadata.updater?.fullName ?? "someone"}
							</>
						)}
					</Text>
				)}
			</Stack>
			<SimpleGrid columns={10} gap="{spacing.4}">
				<GridItem colSpan={{ base: 5 }}>
					<Field required label="Description" {...renderError(validating, formState.description.error)}>
						<Input
							readOnly={!editing}
							value={formState.description.value}
							placeholder="Enter bill description"
							pointerEvents={editing ? undefined : "none"}
							onChange={(event) => dispatch({ type: "changeDescription", payload: { description: event.target.value } })}
						/>
					</Field>
				</GridItem>
				<GridItem colSpan={{ base: 3 }}>
					<Field label="Issued at" {...renderError(validating, formState.issuedAt.error)}>
						<Input
							readOnly={!editing}
							placeholder="20/mm/yy"
							value={formState.issuedAt.input}
							pointerEvents={editing ? undefined : "none"}
							onBlur={() => dispatch({ payload: {}, type: "submitIssuedAt" })}
							onChange={(event) => dispatch({ type: "changeIssuedAt", payload: { issuedAt: event.target.value } })}
						/>
					</Field>
				</GridItem>

				<BillMemberInputs
					users={users}
					label="Creditor"
					readonly={!editing}
					validating={validating}
					amountLabel="Total Amount"
					member={formState.creditor}
					onUserChange={(userId) => dispatch({ type: "changeUser", payload: { userId, memberKind: "creditor" } })}
					onAmountChange={(amount) => {
						dispatch({ type: "changeAmount", payload: { input: amount, memberKind: "creditor" } });
					}}
				/>
				{formState.debtors.map((debtor, debtorIndex) => {
					return (
						<BillMemberInputs
							member={debtor}
							key={debtorIndex}
							readonly={!editing}
							validating={validating}
							amountLabel="Split Amount"
							label={`Debtor ${debtorIndex + 1}`}
							onUserChange={(userId) => dispatch({ type: "changeUser", payload: { userId, debtorIndex, memberKind: "debtor" } })}
							users={users.filter((user) => user.id === debtor.user.userId || !formState.debtors.some((d) => d.user.userId === user.id))}
							onAmountChange={(amount) => dispatch({ type: "changeAmount", payload: { debtorIndex, input: amount, memberKind: "debtor" } })}
							action={
								editing && (
									<Button variant="subtle" colorPalette="red" onClick={() => dispatch({ type: "deleteDebtor", payload: { debtorIndex } })}>
										<MdDeleteOutline /> Delete
									</Button>
								)
							}
						/>
					);
				})}
			</SimpleGrid>

			<HStack justifyContent={editing ? "space-between" : "flex-end"}>
				{editing && (
					<Button variant="subtle" onClick={() => dispatch({ payload: {}, type: "addDebtor" })}>
						Add debtor
					</Button>
				)}
				{editing && (
					<HStack>
						{kind === FormKind.UPDATE && (
							<>
								<Button
									variant="subtle"
									onClick={() => {
										setEditing(() => false);
										dispatch({ type: "reset", payload: props.formState });
									}}>
									<MdCancel /> Cancel
								</Button>
								<Button variant="solid" onClick={onSubmit} disabled={hasError}>
									<MdCheck /> Done
								</Button>
							</>
						)}
						{kind === FormKind.CREATE && (
							<Button
								variant="solid"
								onClick={() => {
									if (hasError) {
										setValidating(() => true);
									} else {
										onSubmit();
									}
								}}>
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
			<pre>{JSON.stringify(formState, null, 2)}</pre>
		</Stack>
	);
};
