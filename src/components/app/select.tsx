"use client";

import React from "react";
import { createListCollection } from "@chakra-ui/react";

import {
  SelectItem,
  SelectRoot,
  SelectLabel,
  SelectContent,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";

export const Select: React.FC<{
  items: { value: string; label: string }[];
}> = (props) => {
  const collection = createListCollection(props);

  return (
    <SelectRoot size="md" collection={collection}>
      <SelectLabel>Debtor</SelectLabel>
      <SelectTrigger>
        <SelectValueText placeholder="Select movie" />
      </SelectTrigger>
      <SelectContent>
        {collection.items.map(({ value, label }) => (
          <SelectItem key={value} item={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};
