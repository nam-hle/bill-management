import { z } from "zod";

const schema = z.object({
	y: z.boolean().default(true),
	z: z.number({ coerce: true }).default(0),
	x: z.boolean({ coerce: true }).default(false)
});

console.log(schema.safeParse({ z: "3", x: "aa" }));
