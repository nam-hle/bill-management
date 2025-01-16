"use client";

import React from "react";
import { format } from "date-fns";
import { IoIosAddCircle } from "react-icons/io";
import { MdEdit, MdCheck, MdCancel } from "react-icons/md";
import { Text, Input, Stack, HStack, Heading, GridItem, SimpleGrid } from "@chakra-ui/react";

import { noop } from "@/utils";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/app/select";
import { FormKind, type ClientUser, type BillFormState } from "@/types";
import { NumberInputRoot, NumberInputField } from "@/components/ui/number-input";

export const BillForm: React.FC<{
	users: ClientUser[];
	formState: BillFormState;
}> = (props) => {
	const { users } = props;
	const [formState, setFormState] = React.useState<BillFormState>(() => props.formState);

	const onSubmit = React.useCallback(async () => {
		if (formState.kind === FormKind.CREATE) {
			await fetch("/api/bills", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(formState)
			}).then((res) => res.json());

			return;
		}

		if (formState.kind === FormKind.UPDATE) {
			await fetch(`/api/bills/${formState.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(formState)
			}).then((res) => res.json());

			return;
		}
	}, [formState]);

	return (
		<Stack gap="{spacing.4}">
			<Heading>{props.formState ? "Bill Details" : "New Bill"}</Heading>
			<SimpleGrid columns={9} gap="{spacing.4}">
				<GridItem colSpan={{ base: 5 }}>
					<Field required label="Description">
						<Input
							value={formState.description}
							placeholder="Enter bill description"
							onChange={(e) =>
								setFormState((prev) => ({
									...prev,
									description: e.target.value
								}))
							}
						/>
					</Field>
				</GridItem>
				<GridItem colSpan={{ base: 4 }}>
					<Field readOnly label="Created at">
						<Text>{props.formState?.createdAt ? format(new Date(props.formState.createdAt), "PPpp") : ""}</Text>
					</Field>
				</GridItem>

				<MemberInputs
					users={users}
					memberIndex={0}
					memberKind="creditor"
					value={formState.creditor}
					onValueChange={(newValue) => {
						if (newValue === null) {
							throw new Error("Creditor is required");
						}

						setFormState((prev) => ({ ...prev, creditor: newValue }));
					}}
				/>
				{formState.debtors.map((debtor, index) => {
					return (
						<MemberInputs
							key={index}
							users={users}
							value={debtor}
							memberIndex={index}
							memberKind="debtor"
							onValueChange={(newValue) => {
								setFormState((prev) => ({
									...prev,
									debtors: prev.debtors.flatMap((d, i) => {
										if (i !== index) {
											return d;
										}

										if (newValue === null) {
											return [];
										}

										return { ...d, ...newValue };
									})
								}));
							}}
						/>
					);
				})}
			</SimpleGrid>

			<HStack justifyContent={formState.editing ? "space-between" : "flex-end"}>
				{formState.editing && (
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
				{formState.editing && (
					<HStack>
						{formState.kind === FormKind.UPDATE && (
							<Button onClick={noop} variant="solid">
								<MdCancel /> Cancel
							</Button>
						)}
						<Button variant="solid" onClick={onSubmit}>
							{formState.kind === FormKind.CREATE ? <IoIosAddCircle /> : <MdCheck />} {formState.kind === FormKind.CREATE ? "Create" : "Done"}
						</Button>
					</HStack>
				)}
				{!formState.editing && (
					<Button variant="solid" onClick={() => setFormState((prev) => ({ ...prev, editing: true }))}>
						<MdEdit /> Edit
					</Button>
				)}
			</HStack>
		</Stack>
	);
};

export const MemberInputs: React.FC<{
	memberKind: "creditor" | "debtor";
	memberIndex: number;
	users: ClientUser[];
	editing?: boolean;
	value: { userId?: string; amount?: number } | undefined;
	onValueChange: (value: { userId?: string; amount?: number } | null) => void;
}> = ({ users, memberIndex, memberKind, value, onValueChange, editing }) => {
	const label = memberKind === "creditor" ? "Creditor" : `Debtor ${memberIndex + 1}`;

	return (
		<>
			<GridItem colSpan={{ base: 4 }}>
				<Select
					label={label}
					disabled={!editing}
					value={value?.userId}
					onValueChange={(userId) => onValueChange({ ...value, userId })}
					items={users.map((user) => ({ label: user.fullName, value: user.id }))}
				/>
			</GridItem>

			<GridItem colSpan={{ base: 4 }}>
				<Field required={memberKind === "creditor"} label={memberKind === "creditor" ? "Total Amount" : "Split Amount"}>
					<NumberInputRoot
						min={0}
						width="100%"
						disabled={!editing}
						value={String(value?.amount ?? "")}
						onValueChange={(e) => onValueChange({ ...value, amount: parseInt(e.value, 10) })}>
						<NumberInputField />
					</NumberInputRoot>
				</Field>
			</GridItem>

			<GridItem alignSelf="flex-end" justifySelf="flex-end">
				{editing && (
					<Button variant="subtle" colorPalette="red" onClick={() => onValueChange(null)}>
						Delete
					</Button>
				)}
			</GridItem>
		</>
	);
};
