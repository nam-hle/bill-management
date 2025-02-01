import { NextResponse, type NextRequest } from "next/server";

import { createSupabaseServer } from "@/supabase/server";

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const bucketName = searchParams.get("bucketName");
	const path = searchParams.get("path");

	if (!bucketName || !path) {
		return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
	}

	try {
		const supabase = await createSupabaseServer();
		const { data, error } = await supabase.storage.from(bucketName).download(path);

		if (error) {
			throw error;
		}

		const buffer = await data.arrayBuffer();

		return new NextResponse(buffer, {
			status: 200,
			headers: {
				"Content-Type": data.type,
				"Content-Disposition": `inline; filename="${path}"`
			}
		});
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error("Error downloading image:", error);

		return NextResponse.json({ error: "Failed to download image" }, { status: 500 });
	}
}
