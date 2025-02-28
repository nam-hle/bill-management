import { z } from "zod";
import axios from "axios";
import type { NextRequest } from "next/server";

import { API } from "@/api";
import { RouteUtils } from "@/route.utils";

export async function GET(_request: NextRequest) {
	try {
		const banksResponse = await axios.get("https://api.vietqr.io/v2/banks");

		const result = ResponseSchema.safeParse(banksResponse.data);

		if (!result.success) {
			throw new Error("Failed to parse response");
		}

		return RouteUtils.createResponse(
			API.Banks.List.ResponseSchema,
			result.data.data.map(
				(bank) => ({ providerNumber: bank.bin, providerName: `${bank.name} (${bank.shortName})` }) satisfies z.infer<typeof API.Banks.List.BankSchema>
			)
		);
	} catch (error) {
		return RouteUtils.ServerError;
	}
}

const BankSchema = z.object({
	bin: z.string(),
	name: z.string(),
	shortName: z.string()
});

const ResponseSchema = z.object({
	data: z.array(BankSchema)
});
