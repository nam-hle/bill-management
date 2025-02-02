import { z } from "zod";
import { expectType } from "tsd";

import { type Json as GeneratedJson } from "../database.types";

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];

export const JsonSchema: z.ZodType<Json> = z.lazy(() => z.union([literalSchema, z.array(JsonSchema), z.record(JsonSchema)]));

expectType<GeneratedJson>({} as z.infer<typeof JsonSchema>);
