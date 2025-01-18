"use client";

import React from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";
import { MdEdit, MdCheck, MdCancel } from "react-icons/md";
import { Text, Input, Stack, HStack, Heading, GridItem, SimpleGrid } from "@chakra-ui/react";

import { noop } from "@/utils";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/app/select";
import { toaster } from "@/components/ui/toaster";
import { FormKind, type ClientUser, type BillFormState } from "@/types";
import { NumberInputRoot, NumberInputField } from "@/components/ui/number-input";

export const BillForm: React.FC<{
	users: ClientUser[];
	formState: BillFormState;
}> = (props) => {
	const { users } = props;
	const [formState, setFormState] = React.useState<BillFormState>(() => props.formState);

	const router = useRouter();

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
			}).then((res) => res.json());

			return;
		}
	}, [formState, router]);

	return (
		<Stack gap="{spacing.4}">
			<Heading>{props.formState ? "Bill Details" : "New Bill"}</Heading>
			<SimpleGrid columns={9} gap="{spacing.4}">
				<GridItem colSpan={{ base: 5 }}>
					<Field required label="Description">
						<Input
							value={formState.description}
							placeholder="Enter bill description"
							disabled={!formState.editing && formState.kind === FormKind.UPDATE}
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
					formKind={formState.kind}
					value={formState.creditor}
					editing={formState.editing}
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
							formKind={formState.kind}
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
	formKind: FormKind;
	memberIndex: number;
	users: ClientUser[];
	editing?: boolean;
	value: { userId?: string; amount?: number } | undefined;
	onValueChange: (value: { userId?: string; amount?: number } | null) => void;
}> = ({ users, memberIndex, memberKind, value, formKind, onValueChange, editing }) => {
	const label = memberKind === "creditor" ? "Creditor" : `Debtor ${memberIndex + 1}`;

	return (
		<>
			<GridItem colSpan={{ base: 4 }}>
				<Select
					label={label}
					value={value?.userId}
					disabled={!editing && formKind === FormKind.UPDATE}
					onValueChange={(userId) => onValueChange({ ...value, userId })}
					items={users.map((user) => ({ label: user.fullName, value: user.id }))}
				/>
			</GridItem>

			<GridItem colSpan={{ base: 4 }}>
				<Field required={memberKind === "creditor"} label={memberKind === "creditor" ? "Total Amount" : "Split Amount"}>
					<NumberInputRoot
						min={0}
						width="100%"
						value={String(value?.amount ?? "")}
						disabled={!editing && formKind === FormKind.UPDATE}
						onValueChange={(e) => onValueChange({ ...value, amount: parseInt(e.value, 10) })}>
						<NumberInputField />
					</NumberInputRoot>
				</Field>
			</GridItem>

			<GridItem alignSelf="flex-end" justifySelf="flex-end">
				{editing && memberKind === "debtor" && (
					<Button variant="subtle" colorPalette="red" onClick={() => onValueChange(null)}>
						Delete
					</Button>
				)}
			</GridItem>
		</>
	);
};
