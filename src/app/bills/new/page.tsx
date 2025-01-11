import { Stack, Input, Heading, SimpleGrid } from "@chakra-ui/react";

import { Field } from "@/components/ui/field";
import { createClient } from "@/supabase/server";
import { Select } from "@/components/app/select";
import {
  NumberInputRoot,
  NumberInputField,
} from "@/components/ui/number-input";

export default async function NewBillPage() {
  const supabase = await createClient();
  const { data: users } = await supabase.from("users").select();

  return (
    <Stack>
      <Heading>New Bill</Heading>
      <SimpleGrid gap="40px" columns={2}>
        <Field required label="Description">
          <Input placeholder="Enter bill description" />
        </Field>
        <Field label="Amount">
          <NumberInputRoot min={0}>
            <NumberInputField />
          </NumberInputRoot>
        </Field>

        <Select
          items={
            users?.map((user) => {
              return { label: user.username, value: user.id };
            }) ?? []
          }
        />
      </SimpleGrid>
    </Stack>
  );
}
