"use client";

import React from "react";
import { TbSum } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";
import { MdEdit, MdCheck, MdCancel, MdDeleteOutline } from "react-icons/md";
import { Text, Input, Stack, HStack, Heading, GridItem, SimpleGrid } from "@chakra-ui/react";

import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";
import { formatTime, isValidDate, formatDistanceTime } from "@/utils";
import { BillMemberInputs } from "@/components/app/bill-member-inputs";
import { FormKind, type ClientUser, type BillFormState } from "@/types";

namespace BillForm {
	export interface Props {
		readonly kind: FormKind;
		readonly billId?: string;
		readonly users: ClientUser[];
		readonly formState: BillFormState;
	}
}

export const BillForm: React.FC<BillForm.Props> = (props) => {
	const { kind, users, billId } = props;
	const [formState, setFormState] = React.useState<BillFormState>(() => props.formState);
	const [editing, setEditing] = React.useState(() => kind === FormKind.CREATE);
	const [editedCreditorAmount, setEditedCreditorAmount] = React.useState(() => false);

	const sumCreditorAmount = React.useMemo(() => {
		const sum = formState.debtors.reduce((acc, debtor) => acc + (debtor.amount ?? 0), 0);

		if ((props.formState.creditor.amount ?? 0) !== sum) {
			return undefined;
		}

		return sum;
	}, [formState.debtors, props.formState.creditor.amount]);

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
	console.log(formState.issuedAt, isValidDate(formState.issuedAt));

	return (
		<Stack gap="{spacing.4}">
			<Stack gap={0}>
				<Heading>{kind === FormKind.UPDATE ? "Bill Details" : "New Bill"}</Heading>
				{kind === FormKind.UPDATE && (
					<Text color="grey" textStyle="xs" fontStyle="italic">
						Created <span title={formatTime(formState.createdAt)}>{formatDistanceTime(formState.createdAt)}</span> by {formState.creditor.fullName}
						{formState.updatedAt && formState.updatedAt !== formState.createdAt && (
							<>
								{" "}
								• Last updated <span title={formatTime(formState.updatedAt)}>{formatDistanceTime(formState.updatedAt)}</span>
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
							onChange={(event) => setFormState((currentFormState) => ({ ...currentFormState, description: event.target.value }))}
						/>
					</Field>
				</GridItem>
				<GridItem colSpan={{ base: 3 }}>
					<Field
						label="Issued at"
						invalid={!isValidDate(formState.issuedAt)}
						errorText={!isValidDate(formState.issuedAt) ? "Invalid date format dd/mm/yy" : undefined}>
						<Input
							placeholder="dd/mm/yy"
							value={formState.issuedAt ?? ""}
							onChange={(event) => {
								setFormState((currentFormState) => ({ ...currentFormState, issuedAt: event.target.value }));
							}}
						/>
					</Field>
				</GridItem>

				<BillMemberInputs
					users={users}
					label="Creditor"
					disabled={!editing}
					amountLabel="Total Amount"
					userId={formState.creditor.userId}
					amount={formState.creditor.amount}
					autoFilledAmount={editedCreditorAmount || !editing ? undefined : sumCreditorAmount}
					onUserChange={(userId) => setFormState((currentFormState) => ({ ...currentFormState, creditor: { ...currentFormState.creditor, userId } }))}
					onAmountChange={(amount) => {
						setEditedCreditorAmount(() => true);
						setFormState((currentFormState) => ({ ...currentFormState, creditor: { ...currentFormState.creditor, amount } }));
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
							amount={debtor.amount}
							amountLabel="Split Amount"
							label={`Debtor ${debtorIndex + 1}`}
							users={users.filter((user) => user.id === debtor.userId || !formState.debtors.some((d) => d.userId === user.id))}
							onUserChange={(userId) => {
								setFormState((currentFormState) => ({
									...currentFormState,
									debtors: currentFormState.debtors.map((debtor, i) => {
										if (i !== debtorIndex) {
											return debtor;
										}

										return { ...debtor, userId };
									})
								}));
							}}
							onAmountChange={(amount) => {
								setFormState((currentFormState) => ({
									...currentFormState,
									debtors: currentFormState.debtors.map((debtor, i) => {
										if (i !== debtorIndex) {
											return debtor;
										}

										return { ...debtor, amount };
									})
								}));
							}}
							action={
								editing && (
									<Button
										variant="subtle"
										colorPalette="red"
										onClick={() => {
											setFormState((currentFormState) => ({
												...currentFormState,
												debtors: currentFormState.debtors.filter((_, i) => i !== debtorIndex)
											}));
										}}>
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
					<Button
						variant="subtle"
						onClick={() => setFormState((currentFormState) => ({ ...currentFormState, debtors: [...currentFormState.debtors, {}] }))}>
						Add debtor
					</Button>
				)}
				{editing && (
					<HStack>
						{kind === FormKind.UPDATE && (
							<Button variant="subtle" onClick={() => setEditing(() => false)}>
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
		</Stack>
	);
};
