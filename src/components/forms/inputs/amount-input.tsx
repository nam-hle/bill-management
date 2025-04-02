import { NumericFormat } from "react-number-format";
import React, { type ChangeEventHandler } from "react";

import { Input } from "@/components/shadcn/input";

export const AmountInput: React.FC<{ value: string; disabled?: boolean; onChange: ChangeEventHandler<HTMLInputElement> }> = (props) => {
	const { value, disabled, onChange } = props;

	return <NumericFormat suffix=" ₫" value={value} thousandSeparator disabled={disabled} customInput={Input} onChange={onChange} />;
};
