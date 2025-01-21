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
import { formatTime, formatDistanceTime } from "@/utils";
import { BillMemberInputs } from "@/components/app/bill-member-inputs";
import { FormKind, type ClientUser, type BillFormState } from "@/types";

export const BillForm: React.FC<{
	users: ClientUser[];
	formState: BillFormState;
}> = (props) => {
	const { users } = props;
	const [formState, setFormState] = React.useState<BillFormState>(() => props.formState);
	const [editing, setEditing] = React.useState(() => formState.kind === FormKind.CREATE);
	const router = useRouter();

	const [editedCreditorAmount, setEditedCreditorAmount] = React.useState(() => false);
	const sumCreditorAmount = React.useMemo(() => {
		return formState.debtors.reduce((acc, debtor) => acc + (debtor.amount ?? 0), 0);
	}, [formState.debtors]);

	const onSubmit = React.useCallback(async () => {
		if (formState.kind === FormKind.CREATE) {
			await fetch("/api/bills", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(formState)
			}).then(() => {
				router.push("/bills");

				toaster.create({
					title: "Bill created",
					description: "Bill has been created successfully",
					type: "success"
				});
			});

			return;
		}

		if (formState.kind === FormKind.UPDATE) {
			await fetch(`/api/bills/${formState.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(formState)
			}).then(() => {
				toaster.create({
					title: "Bill updated",
					description: "Bill has been updated successfully",
					type: "success"
				});
				setFormState((prev) => ({ ...prev, editing: false }));
			});

			return;
		}
	}, [formState, router]);

	return (
		<Stack gap="{spacing.4}">
			<Stack gap={0}>
				<Heading>{formState.kind === FormKind.UPDATE ? "Bill Details" : "New Bill"}</Heading>
				{formState.kind === FormKind.UPDATE && (
					<Text color="grey" textStyle="xs" fontStyle="italic">
						Created <span title={formatTime(formState.createdAt)}>{formatDistanceTime(formState?.createdAt)}</span> by {formState.creditor.fullName}
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
							value={formState.description}
							placeholder="Enter bill description"
							disabled={!editing && formState.kind === FormKind.UPDATE}
							onChange={(e) =>
								setFormState((prev) => ({
									...prev,
									description: e.target.value
								}))
							}
						/>
					</Field>
				</GridItem>
				<GridItem colSpan={{ base: 5 }}></GridItem>

				<BillMemberInputs
					users={users}
					label="Creditor"
					disabled={!editing}
					memberKind="creditor"
					value={formState.creditor}
					autoFilledAmount={editedCreditorAmount || !editing ? undefined : sumCreditorAmount}
					onUserChange={(userId) => {
						setFormState((prev) => ({ ...prev, creditor: { ...prev.creditor, userId } }));
					}}
					onAmountChange={(amount) => {
						setEditedCreditorAmount(() => true);
						setFormState((prev) => ({ ...prev, creditor: { ...prev.creditor, amount } }));
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
							value={debtor}
							key={debtorIndex}
							memberKind="debtor"
							disabled={!editing}
							label={`Debtor ${debtorIndex + 1}`}
							users={users.filter((user) => user.id === debtor.userId || !formState.debtors.some((d) => d.userId === user.id))}
							onUserChange={(userId) => {
								setFormState((prev) => ({
									...prev,
									debtors: prev.debtors.map((d, i) => {
										if (i !== debtorIndex) {
											return d;
										}

										return { ...d, userId };
									})
								}));
							}}
							onAmountChange={(amount) => {
								setFormState((prev) => ({
									...prev,
									debtors: prev.debtors.map((d, i) => {
										if (i !== debtorIndex) {
											return d;
										}

										return { ...d, amount };
									})
								}));
							}}
							action={
								editing ? (
									<Button
										variant="subtle"
										colorPalette="red"
										onClick={() => {
											setFormState((prev) => ({
												...prev,
												debtors: prev.debtors.filter((_, i) => i !== debtorIndex)
											}));
										}}>
										<MdDeleteOutline /> Delete
									</Button>
								) : undefined
							}
						/>
					);
				})}
			</SimpleGrid>

			<HStack justifyContent={editing ? "space-between" : "flex-end"}>
				{editing && (
					<Button
						onClick={() => {
							setFormState((prev) => ({
								...prev,
								debtors: [...prev.debtors, {}]
							}));
						}}>
						Add debtor
					</Button>
				)}
				{editing && (
					<HStack>
						{formState.kind === FormKind.UPDATE && (
							<Button variant="solid" onClick={() => setEditing(() => false)}>
								<MdCancel /> Cancel
							</Button>
						)}
						<Button variant="solid" onClick={onSubmit}>
							{formState.kind === FormKind.CREATE ? <IoIosAddCircle /> : <MdCheck />} {formState.kind === FormKind.CREATE ? "Create" : "Done"}
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
