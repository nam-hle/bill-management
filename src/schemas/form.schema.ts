import { z } from "zod";
import { parse, isValid } from "date-fns";

import { CLIENT_DATE_FORMAT } from "@/utils";

export const FormAmountFieldSchema = z
	.string()
	.refine((val) => val !== "", "Amount is required")
	.refine((val) => /^[1-9]\d*$/.test(val), "Amount must be a number greater than zero");

export const FormIssuedDateField = z
	.string()
	.min(1, "Issued date is required")
	.refine((val) => {
		try {
			return isValid(parse(val, CLIENT_DATE_FORMAT, new Date()));
		} catch {
			return false;
		}
	}, `Issued date must be a valid date and in ${CLIENT_DATE_FORMAT} format`);

export const BillFormStateSchema = z.object({
	issuedAt: FormIssuedDateField,
	// receiptField: z.string().optional(),
	creditor: z.object({ userId: z.string(), amount: FormAmountFieldSchema }),
	// debtors: z.array(z.object({ userId: z.string(), amount: FormAmountFieldSchema })),
	description: z.string().max(50, "Description is too long").min(1, "Description is required")
});
export type NewFormState = z.infer<typeof BillFormStateSchema>;
