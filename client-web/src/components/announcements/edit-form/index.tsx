import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import * as z from "zod";
import { AlertError } from "#/components/alert-error";
import { editAnnouncement } from "#/lib/announcements/api";
import type {
	Announcement,
	AnnouncementCategory,
} from "#/lib/announcements/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";
import { CategoriesSelect } from "./multi-select";

const publishedAtSchema = z.string().superRefine((value, ctx) => {
	const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/);

	if (!match) {
		ctx.addIssue({
			code: "custom",
			message: "Expected format: MM/DD/YYYY HH:mm",
		});
		return;
	}

	const [, month, day, _year, hour, minute] = match;

	if (+month < 1 || +month > 12) {
		ctx.addIssue({
			code: "custom",
			message: "Month must be between 01 and 12",
		});
	}

	if (+day < 1 || +day > 31) {
		ctx.addIssue({
			code: "custom",
			message: "Day must be between 01 and 31",
		});
	}

	if (+hour < 0 || +hour > 23) {
		ctx.addIssue({
			code: "custom",
			message: "Hour must be between 00 and 23",
		});
	}

	if (+minute < 0 || +minute > 59) {
		ctx.addIssue({
			code: "custom",
			message: "Minute must be between 00 and 59",
		});
	}
});

const formSchema = z.object({
	title: z.string().min(1, "Title cannot be empty"),
	content: z.string().min(1, "Content cannot be empty"),
	categoryIds: z
		.array(z.string())
		.min(1, "Announcement must have at least one category"),
	publishedAt: publishedAtSchema,
});

export type EditFormValues = z.infer<typeof formSchema>;

function fieldFormattedDate(date: Date) {
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function EditForm({
	announcement,
	categories,
	onSubmit,
	error,
}: {
	announcement: Announcement;
	categories: AnnouncementCategory[];
	onSubmit: ({ value }: { value: EditFormValues }) => void;
	error: Error | null;
}) {
	const form = useForm({
		defaultValues: {
			title: announcement.title,
			content: announcement.content,
			categoryIds: announcement.categories.map((c) => c.id),
			publishedAt: fieldFormattedDate(announcement.publishedAt),
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit,
	});

	return (
		<Card>
			<CardContent>
				<form
					id="edit-announcement-form"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<FieldGroup>
						<form.Field
							name="title"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Title</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder=""
											autoComplete="off"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
						<form.Field
							name="content"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Content</FieldLabel>
										<InputGroup>
											<InputGroupTextarea
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder=""
												rows={6}
												className="min-h-24 resize-none"
												aria-invalid={isInvalid}
											/>
										</InputGroup>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>

						<form.Field
							name="categoryIds"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Category</FieldLabel>
										<FieldDescription>
											Select category so readers know what your announcement is
											about.
										</FieldDescription>

										<CategoriesSelect
											categories={categories}
											value={field.state.value}
											onChange={field.handleChange}
										/>

										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>

						<form.Field
							name="publishedAt"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>
											Publication date
										</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder=""
											autoComplete="off"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
					</FieldGroup>
				</form>

				{error && (
					<div className="mt-5">
						<AlertError error={error} />
					</div>
				)}
			</CardContent>
			<CardFooter>
				<Field orientation="horizontal">
					<Button type="button" variant="outline" onClick={() => form.reset()}>
						Reset
					</Button>
					<Button type="submit" form="edit-announcement-form">
						Publish
					</Button>
				</Field>
			</CardFooter>
		</Card>
	);
}
