import { z } from "zod";

export const ClientUserSchema = z.object({
	id: z.string(),
	username: z.string(),
	fullName: z.string()
});

export type ClientUser = z.infer<typeof ClientUserSchema>;

export const ProfileFormPayloadSchema = z.object({
	fullName: z.string(),
	avatarUrl: z.string().nullable()
});

export type ProfileFormPayload = z.infer<typeof ProfileFormPayloadSchema>;

export const LoginFormPayloadSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters")
});
export type LoginFormPayload = z.infer<typeof LoginFormPayloadSchema>;

export const SignUpFormSchema = z
	.object({
		confirmPassword: z.string(),
		email: z.string().email("Invalid email address"),
		fullName: z.string().min(1, "Display name is required"),
		password: z.string().min(6, "Password must be at least 6 characters")
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords do not match"
	});

export type SignUpForm = z.infer<typeof SignUpFormSchema>;

export const SignUpPayloadSchema = SignUpFormSchema.innerType().omit({ confirmPassword: true });
// @ts-expect-error ABC
export const SignUpPayload = z.infer<typeof SignUpPayloadSchema>;
