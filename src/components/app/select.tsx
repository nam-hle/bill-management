"use client";

import React from "react";
import { createListCollection } from "@chakra-ui/react";

import { noop } from "@/utils";
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
  value?: string;
  items: { value: string; label: string }[];
}> = (props) => {
  const collection = createListCollection(props);

  return (
    <SelectRoot
      size="md"
      onChange={noop}
      collection={collection}
      value={props.value ? [props.value] : []}
    >
      <SelectLabel>{props.label}</SelectLabel>
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
