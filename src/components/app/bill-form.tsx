"use client";

import React from "react";
import { TbSum } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";
import { parse, format, isValid } from "date-fns";
import { MdEdit, MdCheck, MdCancel, MdDeleteOutline } from "react-icons/md";
import { Text, Input, Stack, HStack, Heading, GridItem, SimpleGrid } from "@chakra-ui/react";

import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";
import { BillMemberInputs } from "@/components/app/bill-member-inputs";
import { FormKind, type ClientUser, type BillFormState } from "@/types";
import { formatTime, formatDate, formatDistanceTime, SERVER_DATE_FORMAT, CLIENT_DATE_FORMAT } from "@/utils";

namespace BillForm {
	export interface Props {
		readonly kind: FormKind;
		readonly billId?: string;
		readonly users: ClientUser[];
		readonly formState: BillFormState;
	}
}

interface MemberState {
	userId?: string;
	amount: {
		input: string;
		error?: string;
		value?: number;
	};
}
namespace MemberState {
	export function fromBillMemberState(memberState: BillFormState["creditor"]): MemberState {
		const { userId, amount } = memberState;

		return {
			userId,
			amount: { value: amount, input: amount === undefined ? "" : String(amount) }
		};
	}
}

type MemberKind = { memberKind: "creditor" } | { debtorIndex: number; memberKind: "debtor" };

interface FormState {
	readonly description: string;
	readonly creditor: MemberState;
	readonly debtors: MemberState[];
	readonly issuedAt: {
		input: string;
		error?: string;
		value: string | null;
	};
}

namespace FormState {
	export function create(formState: BillFormState): FormState {
		const { description } = formState;
		const issuedAt = formState.issuedAt ?? format(new Date(), SERVER_DATE_FORMAT);

		return {
			description,
			creditor: MemberState.fromBillMemberState(formState.creditor),
			debtors: formState.debtors.map(MemberState.fromBillMemberState),
			issuedAt: { value: issuedAt, input: formatDate(issuedAt).client }
		};
	}
}

type Action =
	| { payload: {}; type: "addDebtor" }
	| { type: "reset"; payload: BillFormState }
	| { type: "changeIssuedAt"; payload: { issuedAt: string } }
	| { payload: {}; type: "submitIssuedAt" }
	| { type: "deleteDebtor"; payload: { debtorIndex: number } }
	| { type: "changeDescription"; payload: { description: string } }
	| { type: "changeUser"; payload: MemberKind & { userId: string } }
	| { type: "changeAmount"; payload: MemberKind & { input: string } };

const reducer = (state: FormState, action: Action): FormState => {
	const { type, payload } = action;

	switch (type) {
		case "reset":
			return FormState.create(payload);

		case "addDebtor":
			return { ...state, debtors: [...state.debtors, { amount: { input: "" } }] };
		case "deleteDebtor":
			return { ...state, debtors: state.debtors.filter((_, index) => index !== payload.debtorIndex) };

		case "changeDescription":
			return { ...state, description: payload.description };
		case "changeIssuedAt":
			const parsedDate = parse(payload.issuedAt, CLIENT_DATE_FORMAT, new Date());
			const isValidDate = isValid(parsedDate);

			return {
				...state,
				issuedAt: {
					input: payload.issuedAt,
					value: isValidDate ? format(parsedDate, SERVER_DATE_FORMAT) : null,
					error: isValidDate ? undefined : `Invalid date format ${CLIENT_DATE_FORMAT}`
				}
			};
		case "submitIssuedAt":
			if (state.issuedAt.error) {
				return state;
			}

			return { ...state, issuedAt: { ...state.issuedAt, input: formatDate(state.issuedAt.value).client } };
		case "changeUser":
			if (payload.memberKind === "creditor") {
				return { ...state, creditor: { ...state.creditor, userId: payload.userId } };
			}

			return {
				...state,
				debtors: state.debtors.map((debtor, index) => (index === payload.debtorIndex ? { ...debtor, userId: payload.userId } : debtor))
			};
		case "changeAmount":
			const input = payload.input;
			const currentState = payload.memberKind === "creditor" ? state.creditor : state.debtors[payload.debtorIndex];
			const mergeState = (nextState: MemberState) => {
				if (payload.memberKind === "creditor") {
					return { ...state, creditor: nextState };
				}

				if (payload.memberKind === "debtor") {
					return { ...state, debtors: state.debtors.map((debtor, index) => (index === payload.debtorIndex ? nextState : debtor)) };
				}

				// @ts-expect-error Invalid member kidn
				throw new Error(`Unhandled member kind: ${payload.memberKind}`);
			};

			if (input === "") {
				return mergeState({ ...currentState, amount: { input: "", value: undefined } });
			}

			const amount = parseInt(input, 10);

			if (isNaN(amount)) {
				return mergeState({ ...currentState, amount: { input, error: "Amount must be a number" } });
			}

			return mergeState({ ...currentState, amount: { input, value: amount } });
		default:
			throw new Error(`Unhandled action type: ${action}`);
	}
};

export const BillForm: React.FC<BillForm.Props> = (props) => {
	const { kind, users, billId } = props;
	const { createdAt, updatedAt } = props.formState;
	const [formState, dispatch] = React.useReducer(reducer, FormState.create(props.formState));
	const [editing, setEditing] = React.useState(() => kind === FormKind.CREATE);
	const [editedCreditorAmount, setEditedCreditorAmount] = React.useState(() => false);

	// const sumCreditorAmount = React.useMemo(() => {
	// 	const sum = formState.debtors.reduce((acc, debtor) => acc + (debtor.amount.value ?? 0), 0);
	//
	// 	if ((props.formState.creditor.amount ?? 0) !== sum) {
	// 		return undefined;
	// 	}
	//
	// 	return sum;
	// }, [formState.debtors, props.formState.creditor.amount]);

	const router = useRouter();
	const onSubmit = React.useCallback(async () => {
		if (kind === FormKind.CREATE) {
			await fetch("/api/bills", {
				method: "POST",
				body: JSON.stringify(formState),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(() => {
				router.push("/bills");

				toaster.create({
					type: "success",
					title: "Bill created",
					description: "Bill has been created successfully"
				});
			});

			return;
		}

		if (kind === FormKind.UPDATE) {
			await fetch(`/api/bills/${billId}`, {
				method: "PUT",
				body: JSON.stringify(formState),
				headers: { "Content-Type": "application/json" }
			}).then(() => {
				toaster.create({
					type: "success",
					title: "Bill updated",
					description: "Bill has been updated successfully"
				});
				setEditing(() => false);
			});

			return;
		}
	}, [billId, formState, kind, router]);

	return (
		<Stack gap="{spacing.4}">
			<Stack gap={0}>
				<Heading>{kind === FormKind.UPDATE ? "Bill Details" : "New Bill"}</Heading>
				{kind === FormKind.UPDATE && (
					<Text color="grey" textStyle="xs" fontStyle="italic">
						Created <span title={formatTime(createdAt)}>{formatDistanceTime(createdAt)}</span> by someone
						{updatedAt && updatedAt !== createdAt && (
							<>
								{" "}
								• Last updated <span title={formatTime(updatedAt)}>{formatDistanceTime(updatedAt)}</span>
							</>
						)}
					</Text>
				)}
			</Stack>
			<SimpleGrid columns={10} gap="{spacing.4}">
				<GridItem colSpan={{ base: 5 }}>
					<Field required label="Description">
						<Input
							disabled={!editing}
							value={formState.description}
							placeholder="Enter bill description"
							onChange={(event) => dispatch({ type: "changeDescription", payload: { description: event.target.value } })}
						/>
					</Field>
				</GridItem>
				<GridItem colSpan={{ base: 3 }}>
					<Field label="Issued at" invalid={!!formState.issuedAt.error} errorText={formState.issuedAt.error}>
						<Input
							placeholder="dd/mm/yy"
							value={formState.issuedAt.input}
							onBlur={() => dispatch({ payload: {}, type: "submitIssuedAt" })}
							onChange={(event) => dispatch({ type: "changeIssuedAt", payload: { issuedAt: event.target.value } })}
						/>
					</Field>
				</GridItem>

				<BillMemberInputs
					users={users}
					label="Creditor"
					disabled={!editing}
					amountLabel="Total Amount"
					userId={formState.creditor.userId}
					amount={formState.creditor.amount.input}
					// autoFilledAmount={editedCreditorAmount || !editing ? undefined : sumCreditorAmount}
					onUserChange={(userId) => dispatch({ type: "changeUser", payload: { userId, memberKind: "creditor" } })}
					onAmountChange={(amount) => {
						dispatch({ type: "changeAmount", payload: { input: amount, memberKind: "creditor" } });
					}}
					action={
						editing && editedCreditorAmount ? (
							<Button
								variant="subtle"
								onClick={() => {
									setEditedCreditorAmount(() => false);
								}}>
								<TbSum /> Sum
							</Button>
						) : undefined
					}
				/>
				{formState.debtors.map((debtor, debtorIndex) => {
					return (
						<BillMemberInputs
							key={debtorIndex}
							disabled={!editing}
							userId={debtor.userId}
							amountLabel="Split Amount"
							amount={debtor.amount.input}
							label={`Debtor ${debtorIndex + 1}`}
							users={users.filter((user) => user.id === debtor.userId || !formState.debtors.some((d) => d.userId === user.id))}
							onUserChange={(userId) => dispatch({ type: "changeUser", payload: { userId, debtorIndex, memberKind: "debtor" } })}
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
							<Button
								variant="subtle"
								onClick={() => {
									setEditing(() => false);
									dispatch({ type: "reset", payload: props.formState });
								}}>
								<MdCancel /> Cancel
							</Button>
						)}
						<Button variant="solid" onClick={onSubmit}>
							{kind === FormKind.CREATE ? (
								<>
									<IoIosAddCircle /> Create
								</>
							) : (
								<>
									<MdCheck /> Done
								</>
							)}
						</Button>
					</HStack>
				)}
				{!editing && (
					<Button variant="solid" onClick={() => setEditing(() => true)}>
						<MdEdit /> Edit
					</Button>
				)}
			</HStack>
			<pre style={{ fontSize: "12px" }}>{JSON.stringify(formState, null, 2)}</pre>
		</Stack>
	);
};
