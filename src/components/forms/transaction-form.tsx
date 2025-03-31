"use client";

import React from "react";
import { type z } from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { parse, format } from "date-fns";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Wand2, ArrowLeft, ArrowRight } from "lucide-react";

import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Skeleton } from "@/components/shadcn/skeleton";
import { AspectRatio } from "@/components/shadcn/aspect-ratio";
import { Form, FormItem, FormField, FormControl, FormMessage } from "@/components/shadcn/form";
import { Card, CardTitle, CardFooter, CardHeader, CardContent, CardDescription } from "@/components/shadcn/card";

import { Show } from "@/components/mics/show";
import { Select } from "@/components/forms/inputs/select";
import { CopyButton } from "@/components/buttons/copy-button";
import { RequiredLabel } from "@/components/forms/required-label";
import { LoadingButton } from "@/components/buttons/loading-button";
import { SkeletonWrapper } from "@/components/mics/skeleton-wrapper";
import { TransactionAction } from "@/components/mics/transaction-action";
import { TransactionStatusBadge } from "@/components/mics/transaction-status-badge";

import { cn } from "@/utils/cn";
import { trpc } from "@/services";
import { useBanks } from "@/hooks";
import { formatCurrency } from "@/utils/format";
import { CLIENT_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/utils";
import { type Transaction, TransactionCreatePayloadSchema } from "@/schemas";
import { IssuedAtField, IssuedAtFieldTransformer, RequiredAmountFieldSchema } from "@/schemas/form.schema";

namespace TransactionForm {
	export interface Props {
		readonly currentUserId: string;
		readonly kind: { readonly type: "create" } | { readonly type: "update"; readonly transaction: Transaction };
	}
}

const FormStateSchema = TransactionCreatePayloadSchema.omit({ amount: true, issuedAt: true }).extend({
	issuedAt: IssuedAtField,
	amount: RequiredAmountFieldSchema("Amount is required")
});

type FormState = z.infer<typeof FormStateSchema>;

type Screen = "form" | "qr";

export const TransactionForm: React.FC<TransactionForm.Props> = (props) => {
	const { kind, currentUserId } = props;
	const editing = React.useMemo(() => kind.type === "create", [kind.type]);

	const [qrImage, setQrImage] = React.useState<string | undefined>(undefined);
	const [screen, setScreen] = React.useState<Screen>("form");

	const router = useRouter();
	const utils = trpc.useUtils();

	const create = trpc.transactions.create.useMutation({
		onError: () => {
			toast.error("Failed to create transaction");
		},
		onSuccess: () => {
			toast.success("Transaction created successfully", {
				description: "A new transaction has been created and saved successfully. Redirecting to transactions page..."
			});

			utils.transactions.getMany.invalidate().then(() => router.push("/transactions"));
		}
	});
	const form = useForm<FormState>({
		resolver: zodResolver(FormStateSchema),
		defaultValues: {
			amount: kind.type === "update" ? String(kind.transaction.amount) : "",
			receiverId: kind.type === "update" ? kind.transaction.receiver.userId : "",
			bankAccountId: kind.type === "update" ? String(kind.transaction.bankAccountId) : "",
			issuedAt: IssuedAtFieldTransformer.fromServer(kind.type === "update" ? kind.transaction.issuedAt : undefined)
		}
	});
	const { watch, reset, control, setValue, formState, handleSubmit } = form;
	const { isSubmitting } = formState;

	const suggest = trpc.transactions.suggest.useMutation({
		onSuccess: (data) => {
			const suggestion = data.suggestion;

			// TODO: Show in form
			if (!suggestion) {
				toast.error("No suggestion found");

				return;
			}

			reset({ amount: String(suggestion.amount), receiverId: suggestion.receiverId, bankAccountId: suggestion.bankAccountId });
		}
	});

	const receiverId = watch("receiverId");

	const { data: receiverBankAccounts, isPending: isFetchingReceiverBankAccounts } = trpc.user.bankAccounts.useQuery(
		{ userId: receiverId },
		{ enabled: !!receiverId }
	);

	const findBank = useBanks();

	const generate = trpc.transactions.generateQR.useMutation({
		onSuccess: (data) => {
			setQrImage(() => data.url);
		}
	});

	const onSubmit = React.useMemo(() => {
		return handleSubmit((data, event) => {
			const name = event?.target.name;

			if (name === "create") {
				create.mutate({
					...data,
					amount: data.amount === "" ? 0 : Number(data.amount),
					issuedAt: format(parse(data.issuedAt, CLIENT_DATE_FORMAT, new Date()), SERVER_DATE_FORMAT)
				});

				return;
			}

			if (name === "generate") {
				setScreen(() => "qr");
				generate.mutate({ receiverId: data.receiverId, amount: Number(data.amount), bankAccountId: data.bankAccountId ?? "" });

				return;
			}
		});
	}, [create, generate, handleSubmit]);

	const { data: users } = trpc.groups.memberBalances.useQuery({ excludeMe: kind.type === "create" });

	const renderFormScreen = () => {
		return (
			<>
				<FormField
					control={control}
					name="receiverId"
					render={({ field }) => (
						<FormItem>
							<RequiredLabel>Receiver</RequiredLabel>
							<Select
								{...field}
								disabled={!editing}
								onValueChange={(value) => {
									field.onChange(value);
									setValue("bankAccountId", "");
								}}
								items={
									users?.map((user) => {
										return { value: user.userId, label: user.fullName + (kind.type === "create" ? ` (${formatCurrency(user.balance)})` : "") };
									}) ?? []
								}
							/>
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name="bankAccountId"
					render={({ field }) => (
						<FormItem>
							<RequiredLabel>Bank Account</RequiredLabel>
							<SkeletonWrapper skeleton={<Skeleton className="h-10 w-full" />} loading={isFetchingReceiverBankAccounts && !!receiverId}>
								<Select
									value={field.value}
									onValueChange={field.onChange}
									disabled={kind.type === "update"}
									items={
										receiverBankAccounts?.flatMap((account) => {
											return {
												value: account.id,
												label: `${account.accountHolder} (${findBank(account.providerNumber)?.providerShortName ?? "Unknown"} ${account.accountNumber})`
											};
										}) ?? []
									}
								/>
							</SkeletonWrapper>
						</FormItem>
					)}
				/>

				<FormField
					name="amount"
					control={control}
					render={({ field }) => (
						<FormItem>
							<RequiredLabel>Amount</RequiredLabel>
							<FormControl>
								<Input {...field} readOnly={!editing} className={editing ? "" : "pointer-events-none"} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					name="issuedAt"
					control={control}
					render={({ field }) => (
						<FormItem>
							<RequiredLabel>Issued At</RequiredLabel>
							<FormControl>
								<Input placeholder={CLIENT_DATE_FORMAT} {...field} className={editing ? "" : "pointer-events-none"} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</>
		);
	};

	const renderQRScreen = () => {
		return (
			<Show when={qrImage} fallback={<Skeleton className="h-[370px] w-[370px]" />}>
				{(image) => (
					<AspectRatio ratio={1}>
						<Image fill src={image} alt="Transaction QR" data-testid="transaction-qr" className="rounded-lg object-contain" />
					</AspectRatio>
				)}
			</Show>
		);
	};

	return (
		<Form {...form}>
			<form onSubmit={onSubmit}>
				<div className={cn("mx-auto mt-24 w-[420px] flex-1 items-center")}>
					<Card className="w-full">
						<CardHeader>
							<CardTitle className="space-x-2 text-2xl">
								<span>{kind.type === "update" ? "Transaction Details" : "New Transaction"}</span>
								{kind.type === "update" && <TransactionStatusBadge status={kind.transaction.status} />}
							</CardTitle>
							<CardDescription className="flex gap-2 align-middle">
								{kind.type === "update" ? (
									<>
										Transaction ID: {kind.transaction.displayId} <CopyButton displayValue="transaction ID" value={kind.transaction.displayId} />
									</>
								) : (
									"Create a new transaction"
								)}
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-4">{screen === "form" ? renderFormScreen() : renderQRScreen()}</CardContent>
						<CardFooter className="flex flex-col space-y-4">
							{kind.type === "create" ? (
								<div className="flex w-full justify-between">
									{screen === "form" ? (
										<>
											<Button type="button" variant="outline" onClick={() => suggest.mutate()} className="flex items-center gap-2">
												<Wand2 className="h-4 w-4" />
												Auto Fill
											</Button>

											<Button type="submit" name="generate" onClick={onSubmit} className="flex items-center gap-2">
												Next <ArrowRight className="h-4 w-4" />
											</Button>
										</>
									) : (
										<>
											<Button variant="outline" className="flex items-center gap-2" onClick={() => setScreen(() => "form")}>
												<ArrowLeft className="h-4 w-4" /> Back
											</Button>
											<LoadingButton type="submit" name="create" onClick={onSubmit} loading={isSubmitting} loadingText="Creating...">
												<Plus className="h-4 w-4" /> Create
											</LoadingButton>
										</>
									)}
								</div>
							) : (
								<TransactionAction currentUserId={currentUserId} transaction={kind.transaction} />
							)}
						</CardFooter>
					</Card>
				</div>
				{/*<DevTool control={control} />*/}
			</form>
		</Form>
	);
};
