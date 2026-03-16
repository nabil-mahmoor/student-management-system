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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/src/components/ui/input-group";
import { useForm } from "@tanstack/react-form";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import * as z from "zod";

const courseSchema = z.object({
  code: z.string(),

  name: z.string(),

  description: z
    .string()
    .trim()
    .min(10, "Last name must be at least 2 characters")
    .max(500, "Last name must not exceed 500 characters"),

  enrolled: z.number(),

  tags: z.array(z.string()),

  imageUrl: z.url(),
});

export default function CreateCourseForm() {
  const router = useRouter();

  const [image, setImage] = useState<String | null>();

  const form = useForm({
    defaultValues: {
      code: "",
      name: "",
      description: "",
      enrolled: 0,
      tags: [""],
      imageUrl: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      toast.success("Course created");
      router.push("/enroll")
    },
    // validators: {
    //   onSubmit: courseSchema,
    //   onBlur: courseSchema,
    // },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="max-w-md mx-auto"
    >
      <FieldGroup>
        <div className="relative object-cover border rounded-2xl">
          <Image
            src={image ?? "./vercel.svg"}
            height={200}
            width={200}
            alt="course cover image"
          />
        </div>
        <form.Field
          name="imageUrl"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field>
                <FieldDescription>Paste image URL</FieldDescription>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setImage(e);
                  }}
                  onBlur={field.handleBlur}
                  placeholder="https://i.pinimg.com/20a471e8758f883006732aef6727d430.jpg"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

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
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="CS30184"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

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

        <form.Field
          name="description"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="DD/MM/YYYY"
                  />
                  <InputGroupAddon>
                    <CalendarIcon />
                    <span className="sr-only">Select date</span>
                  </InputGroupAddon>
                </InputGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>
      <Button type="submit" className="w-full mt-12">
        Create Course
      </Button>
    </form>
  );
}
