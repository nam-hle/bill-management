"use client";

import React from "react";
import {
  Input,
  Stack,
  HStack,
  Heading,
  GridItem,
  SimpleGrid,
} from "@chakra-ui/react";

import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/app/select";
import { type ClientUser, type BillFormState } from "@/types";
import {
  NumberInputRoot,
  NumberInputField,
} from "@/components/ui/number-input";

export const BillForm: React.FC<{ users: ClientUser[] }> = (props) => {
  const { users } = props;
  const [formState, setFormState] = React.useState<BillFormState>(() => {
    return {
      description: "",
      debtors: [],
    };
  });

  const onSave = React.useCallback(async () => {
    await fetch("/api/bills", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formState),
    }).then((res) => res.json());
  }, [formState]);

  return (
    <Stack gap="{spacing.4}">
      <Heading>New Bill</Heading>
      <SimpleGrid columns={2} gap="{spacing.4}">
        <GridItem colSpan={{ base: 2 }}>
          <Field required label="Description">
            <Input
              value={formState.description}
              placeholder="Enter bill description"
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </Field>
        </GridItem>

        <MemberInputs
          users={users}
          memberIndex={0}
          memberKind="creditor"
          value={formState.creditor}
          onValueChange={(newValue) => {
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
                  debtors: prev.debtors.map((d, i) => {
                    if (i !== index) {
                      return d;
                    }

                    return { ...d, ...newValue };
                  }),
                }));
              }}
            />
          );
        })}
      </SimpleGrid>

      <HStack justifyContent="space-between">
        <Button
          onClick={() => {
            setFormState((prev) => ({
              ...prev,
              debtors: [...prev.debtors, {}],
            }));
          }}
        >
          Add debtor
        </Button>
        <Button variant="solid" onClick={onSave}>
          Save
        </Button>
      </HStack>
    </Stack>
  );
};

export const MemberInputs: React.FC<{
  memberKind: "creditor" | "debtor";
  memberIndex: number;
  users: ClientUser[];
  value: { userId?: string; amount?: number } | undefined;
  onValueChange: (value: { userId?: string; amount?: number }) => void;
}> = ({ users, memberIndex, memberKind, value, onValueChange }) => {
  const label =
    memberKind === "creditor" ? "Creditor" : `Debtor ${memberIndex + 1}`;

  return (
    <>
      <Select
        label={label}
        value={value?.userId}
        onValueChange={(userId) => onValueChange({ ...value, userId })}
        items={users.map((user) => ({ label: user.username, value: user.id }))}
      />

      <Field
        required={memberKind === "creditor"}
        label={memberKind === "creditor" ? "Total Amount" : "Split Amount"}
      >
        <NumberInputRoot
          min={0}
          width="100%"
          value={String(value?.amount ?? "")}
          onValueChange={(e) =>
            onValueChange({ ...value, amount: parseInt(e.value, 10) })
          }
        >
          <NumberInputField />
        </NumberInputRoot>
      </Field>
    </>
  );
};
