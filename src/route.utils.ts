import { type ZodSchema } from "zod";
import { type NextRequest } from "next/server";

export namespace RouteUtils {
	export const BadRequest = new Response(JSON.stringify({ error: "Bad Request" }), { status: 400, headers: { "Content-Type": "application/json" } });
	export const ServerError = new Response(JSON.stringify({ error: "Internal Server Error" }), {
		status: 500,
		headers: { "Content-Type": "application/json" }
	});

	export async function parseRequestSearchParams<T>(request: NextRequest, schema: ZodSchema<T>): Promise<null | T> {
		const result = schema.safeParse(Object.fromEntries(request.nextUrl.searchParams));

		if (!result.success) {
			return null;
		}

		return result.data;
	}

	export async function parseRequestBody<T>(request: Request, schema: ZodSchema<T>): Promise<T | null> {
		const body = await request.json();
		const result = schema.safeParse(body);

		if (!result.success) {
			return null;
		}

		return result.data;
	}

	export function createResponse<T>(schema: ZodSchema<T>, data: unknown): Response {
		const result = schema.safeParse(data);

		if (!result.success) {
			return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
		}

		return new Response(JSON.stringify(result.data), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	}
}
