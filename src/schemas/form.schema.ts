import { z } from "zod";
import { parse, format, isValid } from "date-fns";

import { CLIENT_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/utils";

export const FormAmountFieldSchema = z
	.string()
	.refine((val) => val !== "", "Amount is required")
	.refine((val) => /^[1-9]\d*$/.test(val), "Amount must be a number greater than zero");

export namespace FormAmountFieldSchemaTransformer {
	export function toServer(amount: string) {
		if (amount === "") {
			return 0;
		}

		return parseInt(amount, 10);
	}

	export function fromServer(amount: number) {
		return String(amount);
	}
}

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
export namespace DateFieldTransformer {
	export function toServer(date: string) {
		return format(parse(date, CLIENT_DATE_FORMAT, new Date()), SERVER_DATE_FORMAT);
	}

	export function fromServer(date: string | undefined) {
		if (date === undefined) {
			return format(new Date(), CLIENT_DATE_FORMAT);
		}

		return format(parse(date, SERVER_DATE_FORMAT, new Date()), CLIENT_DATE_FORMAT);
	}
}

export const BillFormMemberSchema = z.object({ userId: z.string(), amount: FormAmountFieldSchema });
export type BillFormMember = z.infer<typeof BillFormMemberSchema>;
export namespace BillFormMemberSchemaTransformer {
	export function toServer(params: BillFormMember) {
		return { ...params, amount: FormAmountFieldSchemaTransformer.toServer(params.amount) };
	}

	export function fromServer(member: { userId: string; amount: number }) {
		return { ...member, amount: FormAmountFieldSchemaTransformer.fromServer(member.amount) };
	}
}

export const BillFormStateSchema = z.object({
	issuedAt: FormIssuedDateField,
	creditor: BillFormMemberSchema,
	// receiptFile: z.string().nullable(),
	debtors: z.array(BillFormMemberSchema),
	description: z.string().max(50, "Description is too long").min(1, "Description is required")
});

export type NewFormState = z.infer<typeof BillFormStateSchema>;
