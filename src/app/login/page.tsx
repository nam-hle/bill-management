import React from "react";
import type { Metadata } from "next";

import { LoginForm } from "@/components/app/login-form";

export const metadata: Metadata = {
	title: "Login"
};

export default function LoginPage() {
	return <LoginForm />;
}
