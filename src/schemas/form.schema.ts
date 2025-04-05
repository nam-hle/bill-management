import { z } from "zod";
import { parse, format, isValid } from "date-fns";

import { CLIENT_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/utils";

const cleanNonNumeric = (val: string) => val.replaceAll(/[^-\d]/g, "");

export const OptionalAmountFieldSchema = z
	.string()
	.refine((val) => val === "" || /^[1-9]\d*$/.test(cleanNonNumeric(val)), "Amount must be a number greater than zero");
export namespace OptionalAmountFieldTransformer {
	export function toServer(amount: string): number {
		if (amount === "") {
			return 0;
		}

		return parseInt(cleanNonNumeric(amount), 10);
	}

	export function fromServer(amount: number): string {
		return String(amount);
	}
}

export const RequiredAmountFieldSchema = (requiredMessage: string) =>
	z
		.string()
		.refine((val) => val !== "", requiredMessage)
		.refine((val) => /^[1-9]\d*$/.test(cleanNonNumeric(val)), "The amount must be a number greater than zero");

export namespace RequiredAmountFieldTransformer {
	export function toServer(amount: string): number {
		return parseInt(cleanNonNumeric(amount), 10);
	}

	export function fromServer(amount: number): string {
		return String(amount);
	}
}

export const IssuedAtField = z
	.string()
	.min(1, "Issued date is required")
	.refine((val) => {
		try {
			return isValid(parse(val, CLIENT_DATE_FORMAT, new Date()));
		} catch {
			return false;
		}
	}, `Issued date must be a valid date and in ${CLIENT_DATE_FORMAT} format`);
export namespace IssuedAtFieldTransformer {
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
