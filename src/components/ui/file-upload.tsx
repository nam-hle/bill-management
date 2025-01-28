"use client";

import * as React from "react";
import { LuX, LuFile, LuUpload } from "react-icons/lu";
import type { ButtonProps, RecipeProps } from "@chakra-ui/react";
import { Icon, Span, Text, Button, useRecipe, IconButton, useFileUploadContext, FileUpload as ChakraFileUpload } from "@chakra-ui/react";

export interface FileUploadRootProps extends ChakraFileUpload.RootProps {
	inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const FileUploadRoot = React.forwardRef<HTMLInputElement, FileUploadRootProps>(function FileUploadRoot(props, ref) {
	const { children, inputProps, ...rest } = props;

	return (
		<ChakraFileUpload.Root {...rest}>
			<ChakraFileUpload.HiddenInput ref={ref} {...inputProps} />
			{children}
		</ChakraFileUpload.Root>
	);
});

export interface FileUploadDropzoneProps extends ChakraFileUpload.DropzoneProps {
	label: React.ReactNode;
	description?: React.ReactNode;
}

export const FileUploadDropzone = React.forwardRef<HTMLInputElement, FileUploadDropzoneProps>(function FileUploadDropzone(props, ref) {
	const { label, children, description, ...rest } = props;

	return (
		<ChakraFileUpload.Dropzone ref={ref} {...rest}>
			<Icon fontSize="xl" color="fg.muted">
				<LuUpload />
			</Icon>
			<ChakraFileUpload.DropzoneContent>
				<div>{label}</div>
				{description && <Text color="fg.muted">{description}</Text>}
			</ChakraFileUpload.DropzoneContent>
			{children}
		</ChakraFileUpload.Dropzone>
	);
});

interface VisibilityProps {
	showSize?: boolean;
	clearable?: boolean;
}

interface FileUploadItemProps extends VisibilityProps {
	file: File;
}

const FileUploadItem = React.forwardRef<HTMLLIElement, FileUploadItemProps>(function FileUploadItem(props, ref) {
	const { file, showSize, clearable } = props;

	return (
		<ChakraFileUpload.Item ref={ref} file={file}>
			<ChakraFileUpload.ItemPreview asChild>
				<Icon fontSize="lg" color="fg.muted">
					<LuFile />
				</Icon>
			</ChakraFileUpload.ItemPreview>

			{showSize ? (
				<ChakraFileUpload.ItemContent>
					<ChakraFileUpload.ItemName />
					<ChakraFileUpload.ItemSizeText />
				</ChakraFileUpload.ItemContent>
			) : (
				<ChakraFileUpload.ItemName flex="1" />
			)}

			{clearable && (
				<ChakraFileUpload.ItemDeleteTrigger asChild>
					<IconButton size="xs" variant="ghost" color="fg.muted">
						<LuX />
					</IconButton>
				</ChakraFileUpload.ItemDeleteTrigger>
			)}
		</ChakraFileUpload.Item>
	);
});

interface FileUploadListProps extends VisibilityProps, ChakraFileUpload.ItemGroupProps {
	files?: File[];
}

export const FileUploadList = React.forwardRef<HTMLUListElement, FileUploadListProps>(function FileUploadList(props, ref) {
	const { files, showSize, clearable, ...rest } = props;

	const fileUpload = useFileUploadContext();
	const acceptedFiles = files ?? fileUpload.acceptedFiles;

	if (acceptedFiles.length === 0) return null;

	return (
		<ChakraFileUpload.ItemGroup ref={ref} {...rest}>
			{acceptedFiles.map((file) => (
				<FileUploadItem file={file} key={file.name} showSize={showSize} clearable={clearable} />
			))}
		</ChakraFileUpload.ItemGroup>
	);
});

type Assign<T, U> = Omit<T, keyof U> & U;

interface FileInputProps extends Assign<ButtonProps, RecipeProps<"input">> {
	placeholder?: React.ReactNode;
}

export const FileInput = React.forwardRef<HTMLButtonElement, FileInputProps>(function FileInput(props, ref) {
	const inputRecipe = useRecipe({ key: "input" });
	const [recipeProps, restProps] = inputRecipe.splitVariantProps(props);
	const { placeholder = "Select file(s)", ...rest } = restProps;

	return (
		<ChakraFileUpload.Trigger asChild>
			<Button py="0" unstyled ref={ref} {...rest} css={[inputRecipe(recipeProps), props.css]}>
				<ChakraFileUpload.Context>
					{({ acceptedFiles }) => {
						if (acceptedFiles.length === 1) {
							return <span>{acceptedFiles[0].name}</span>;
						}

						if (acceptedFiles.length > 1) {
							return <span>{acceptedFiles.length} files</span>;
						}

						return <Span color="fg.subtle">{placeholder}</Span>;
					}}
				</ChakraFileUpload.Context>
			</Button>
		</ChakraFileUpload.Trigger>
	);
});

export const FileUploadLabel = ChakraFileUpload.Label;
export const FileUploadClearTrigger = ChakraFileUpload.ClearTrigger;
export const FileUploadTrigger = ChakraFileUpload.Trigger;
