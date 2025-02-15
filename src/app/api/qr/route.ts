import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";

import { API } from "@/api";
import { RouteUtils } from "@/route.utils";
import { Environments } from "@/environments";
import { BankAccountsController } from "@/controllers";
import { createSupabaseServer } from "@/services/supabase/server";

const VIETQR_API = "https://api.vietqr.io/v2/generate";

export async function POST(request: NextRequest) {
	try {
		const supabase = await createSupabaseServer();
		const body = await RouteUtils.parseRequestBody(request, API.QR.Get.QueryParamsSchema);

		if (!body) {
			return RouteUtils.BadRequest;
		}

		const account = await BankAccountsController.getById(supabase, body.bankAccountId);

		if (!account) {
			return NextResponse.json({ error: "Bank account not found" }, { status: 404 });
		}

		// API request payload
		const payload = {
			addInfo: "ck",
			format: "svg",
			template: "print",
			amount: body.amount,
			acqId: account.providerNumber,
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
