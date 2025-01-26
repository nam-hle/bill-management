"use client";
import { type User } from "@supabase/supabase-js";
import React, { useState, useEffect, useCallback } from "react";
import { Input, Stack, HStack, Heading } from "@chakra-ui/react";

import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { createSupabaseClient } from "@/supabase/client";

export default function AccountForm({ user }: { user: User | null }) {
	const supabase = createSupabaseClient();
	const [loading, setLoading] = useState(true);
	const [fullname, setFullname] = useState<string | null>(null);
	const [username, setUsername] = useState<string | null>(null);
	const [website, setWebsite] = useState<string | null>(null);
	const [avatar_url, setAvatarUrl] = useState<string | null>(null);

	const getProfile = useCallback(async () => {
		try {
			setLoading(true);

			const { data, error, status } = await supabase.from("profiles").select(`fullName, username, website, avatar_url`).eq("id", user?.id).single();

			if (error && status !== 406) {
				throw error;
			}

			if (data) {
				setFullname(data.fullName);
				setUsername(data.username);
				setWebsite(data.website);
				setAvatarUrl(data.avatar_url);
			}
		} catch (error) {
			alert("Error loading user data!");
		} finally {
			setLoading(false);
		}
	}, [user, supabase]);

	useEffect(() => {
		getProfile();
	}, [user, getProfile]);

	async function updateProfile({
		website,
		username,
		avatar_url
	}: {
		website: string | null;
		username: string | null;
		fullname: string | null;
		avatar_url: string | null;
	}) {
		try {
			setLoading(true);

			const { error } = await supabase.from("profiles").upsert({
				website,
				username,
				avatar_url,
				fullName: fullname,
				id: user?.id as string,
				updated_at: new Date().toISOString()
			});

			if (error) throw error;
			alert("Profile updated!");
		} catch (error) {
			alert("Error updating the data!");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Stack width="30%" gap="{spacing.4}" marginInline="auto">
			<Heading>Account</Heading>
			<Field disabled label="Email">
				<Input value={user?.email} placeholder="Enter your email" />
			</Field>
			<Field required label="Full Name">
				<Input value={fullname || ""} placeholder="Enter your password" onChange={(e) => setFullname(e.target.value)} />
			</Field>
			<Field required label="Username">
				<Input value={username || ""} placeholder="Enter your password" onChange={(e) => setUsername(e.target.value)} />
			</Field>
			<HStack justifyContent="flex-end">
				<Button loading={loading} loadingText="Updating..." onClick={() => updateProfile({ website, fullname, username, avatar_url })}>
					Update
				</Button>
			</HStack>
		</Stack>
	);
}
