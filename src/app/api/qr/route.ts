import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";

import { API } from "@/api";
import { Environments } from "@/environments";
import { createSupabaseServer } from "@/services/supabase/server";
import { BankAccountsController } from "@/controllers/bank-accounts.controller";

const VIETQR_API = "https://api.vietqr.io/v2/generate";

export async function POST(request: NextRequest) {
	try {
		const supabase = await createSupabaseServer();
		const body = await request.json();

		const parsedBody = API.QR.Get.QueryParamsSchema.safeParse(body);

		if (parsedBody.error) {
			return new Response(JSON.stringify({ error: "Invalid request body", details: parsedBody.error.errors }), { status: 400 });
		}

		const account = await BankAccountsController.getById(supabase, parsedBody.data.bankAccountId);

		if (!account) {
			return NextResponse.json({ error: "Bank account not found" }, { status: 404 });
		}

		// API request payload
		const payload = {
			addInfo: "ck",
			format: "svg",
			template: "print",
			acqId: account.providerNumber,
			amount: parsedBody.data.amount,
			accountNo: account.accountNumber,
			accountName: account.accountHolder
		};

		// Call VietQR API
		const { data } = await axios.post(VIETQR_API, payload, {
			headers: {
				"x-api-key": Environments.PRIVATE.VIETQR.API_KEY,
				"x-client-id": Environments.PRIVATE.VIETQR.CLIENT_ID
			}
		});

		if (data.code === "00") {
			return NextResponse.json({ qrCode: data.data.qrDataURL });
		} else {
			return NextResponse.json({ details: data, error: "Failed to generate QR Code" }, { status: 500 });
		}
	} catch (error) {
		return NextResponse.json({ error: "QR Code generation failed" }, { status: 500 });
	}
}
