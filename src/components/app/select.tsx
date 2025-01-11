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
  label: string;
  value: string | undefined;
  onValueChange: (value: string) => void;
  items: { value: string; label: string }[];
}> = (props) => {
  const collection = createListCollection(props);

  return (
    <SelectRoot
      size="md"
      collection={collection}
      value={props.value ? [props.value] : []}
      onValueChange={(e) => {
        if (e.value.length !== 1) {
          throw new Error("Expected exactly one value");
        }
        props.onValueChange(e.value[0]);
      }}
    >
      <SelectLabel>{props.label}</SelectLabel>
      <SelectTrigger>
        <SelectValueText placeholder="Select one" />
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
