"use client";

import { Button } from "@/src/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import * as z from "zod";

const editCourseSchema = z.object({
  code: z
    .string()
    .trim()
    .min(4, "Course code must be at least 4 characters")
    .max(10, "Course code must not exceed 10 characters")
    .regex(
      /^[A-Z0-9]+$/,
      "Course code must be uppercase letters and numbers only",
    ),

  name: z
    .string()
    .trim()
    .min(3, "Course name must be at least 3 characters")
    .max(100, "Course name must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),

  imageUrl: z.string().url("Must be a valid image URL"),

  tags: z.string().min(1, "At least one tag is required"),
});

type EditCourseFormProps = {
  course: Course;
};

export default function EditCourseForm({ course }: EditCourseFormProps) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string>(course.imageUrl);

  const form = useForm({
    defaultValues: {
      code: course.code,
      name: course.name,
      description: course.description,
      imageUrl: course.imageUrl,
      // Convert string[] back to comma-separated string for the input
      tags: course.tags.join(", "),
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await fetch(`/api/courses/${course.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...value,
            tags: value.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
          }),
        });

        if (!res.ok) {
          const { error } = await res.json();
          toast.error(error ?? "Failed to update course");
          return;
        }

        toast.success("Course updated successfully");
        router.push("/courses");
        router.refresh();
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    },
    validators: {
      onSubmit: editCourseSchema,
      onBlur: editCourseSchema,
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="max-w-md mx-auto"
    >
      <FieldGroup>
        {/* Image preview */}
        {imagePreview && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border">
            <Image
              src={imagePreview}
              fill
              className="object-cover"
              alt="Course cover preview"
            />
          </div>
        )}

        {/* Image URL */}
        <form.Field
          name="imageUrl"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Cover Image</FieldLabel>
                <FieldDescription>Paste a direct image URL</FieldDescription>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setImagePreview(e.target.value);
                  }}
                  onBlur={field.handleBlur}
                  placeholder="https://example.com/image.jpg"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        {/* Course Code */}
        <form.Field
          name="code"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Course Code</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(e.target.value.toUpperCase())
                  }
                  onBlur={field.handleBlur}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        {/* Course Name */}
        <form.Field
          name="name"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Course Name</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        {/* Description */}
        <form.Field
          name="description"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  rows={4}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        {/* Tags */}
        <form.Field
          name="tags"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Tags</FieldLabel>
                <FieldDescription>
                  Comma-separated — e.g. algorithms, data structures
                </FieldDescription>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <div className="flex gap-4 mt-12">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          <form.Subscribe
            selector={(state) => state.isSubmitting}
            children={(isSubmitting) => (
              <>
                {isSubmitting && <Loader2 className="animate-spin" />}
                {isSubmitting ? "Saving..." : "Save Changes"}
              </>
            )}
          />
        </Button>
      </div>
    </form>
  );
}