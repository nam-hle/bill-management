import * as React from "react";

import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Button } from "@/components/shadcn/button";
import { Select, SelectItem, SelectValue, SelectContent, SelectTrigger } from "@/components/shadcn/select";
import { Card, CardTitle, CardFooter, CardHeader, CardContent, CardDescription } from "@/components/shadcn/card";

export function CardWithForm() {
	return (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Create project</CardTitle>
				<CardDescription>Deploy your new project in one-click.</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="name">Name</Label>
							<Input id="name" placeholder="Name of your project" />
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="framework">Framework</Label>
							<Select>
								<SelectTrigger id="framework">
									<SelectValue placeholder="Select" />
								</SelectTrigger>
								<SelectContent position="popper">
									<SelectItem value="next">Next.js</SelectItem>
									<SelectItem value="sveltekit">SvelteKit</SelectItem>
									<SelectItem value="astro">Astro</SelectItem>
									<SelectItem value="nuxt">Nuxt.js</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button variant="outline">Cancel</Button>
				<Button>Deploy</Button>
			</CardFooter>
		</Card>
	);
}
