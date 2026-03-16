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

const courseSchema = z.object({
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

  // Tags are entered as a comma-separated string then split into an array
  tags: z.string().min(1, "At least one tag is required"),
});

export default function CreateCourseForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false)

  // ✅ string primitive — was incorrectly typed as String (object wrapper)
  const [imagePreview, setImagePreview] = useState<string>("");

  const form = useForm({
    defaultValues: {
      code: "",
      name: "",
      description: "",
      imageUrl: "",
      tags: "", // comma-separated, split on submit
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...value,
            // Convert "algorithms, data structures" → ["algorithms", "data structures"]
            tags: value.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
          }),
        });

        if (!res.ok) {
          const { error } = await res.json();
          toast.error(error ?? "Failed to create course");
          return;
        }

        toast.success("Course created");
        router.push("/courses");
      } catch {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false)
      }
    },
    validators: {
      onSubmit: courseSchema,
      onBlur: courseSchema,
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
                    // ✅ pass the string value, not the event object
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
                  placeholder="CS30184"
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
                  placeholder="Operating Systems"
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
                  placeholder="A brief overview of what this course covers..."
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
                  Comma-separated — e.g. algorithms, data structures, graphs
                </FieldDescription>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="algorithms, data structures, graphs"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <Button disabled={isLoading} type="submit" className="w-full mt-12">
        {isLoading && <Loader2 className="animate-spin" />}
        {isLoading ? "Creating..." : "Create Course"}
      </Button>
    </form>
  );
}