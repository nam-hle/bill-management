import { z } from "zod";

export const ClientUserSchema = z.object({
	id: z.string(),
	username: z.string(),
	fullName: z.string(),
	avatar: z.string().nullable()
});

export type ClientUser = z.infer<typeof ClientUserSchema>;

export const ProfileFormPayloadSchema = z.object({
	fullName: z.string(),
	avatarUrl: z.string().nullable()
});

export type ProfileFormPayload = z.infer<typeof ProfileFormPayloadSchema>;

export const LoginFormPayloadSchema = z.object({
	password: z.string().min(6, "Password must be at least 6 characters"),
	email: z.string().min(1, "Email is required").email("Invalid email address")
});
export type LoginFormPayload = z.infer<typeof LoginFormPayloadSchema>;

export const SignUpFormSchema = LoginFormPayloadSchema.extend({
	confirmPassword: z.string(),
	fullName: z.string().min(1, "Display name is required")
}).refine((data) => data.password === data.confirmPassword, {
	path: ["confirmPassword"],
	message: "Passwords do not match"
});

export type SignUpForm = z.infer<typeof SignUpFormSchema>;

export const SignUpPayloadSchema = SignUpFormSchema.innerType().omit({ confirmPassword: true });
