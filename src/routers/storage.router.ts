import { z } from "zod";

import { BucketNameSchema } from "@/schemas";
import { router, privateProcedure } from "@/services/trpc/server";

export const storageRouter = router({
	get: privateProcedure.input(z.object({ fileName: z.string(), bucketName: BucketNameSchema })).query(async ({ input, ctx: { supabase } }) => {
		const { fileName, bucketName } = input;

		const { data, error } = await supabase.storage.from(bucketName).download(fileName);

		if (error) {
			throw new Error(error.message);
		}

		const buffer = await data.arrayBuffer();

		return `data:${data.type};base64,${Buffer.from(buffer).toString("base64")}`;
	})
});
