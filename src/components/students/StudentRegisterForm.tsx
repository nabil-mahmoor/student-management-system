"use client";

import { Button } from "@/src/components/ui/button";
import {
  Field,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useForm } from "@tanstack/react-form";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as z from "zod";

// ✅ Aligned with Prisma Degree enum — was incorrectly using BCS/BSE/BCE/BIT/BIS
const IntakeEnum = z.enum(["40", "41", "42", "43"]);

const DegreeEnum = z.enum(["BCS", "BSE", "BCE", "DBA", "BIT", "BIS"]);

const DEGREE_LABELS: Record<z.infer<typeof DegreeEnum>, string> = {
  BCS: "BSc Computer Science",
  BSE: "BSc Software Engineering",
  BCE: "BSc Computer Engineering",
  DBA: "BSc Data Science & Business Analytics",
  BIT: "BSc Information Technology",
  BIS: "BSc Information Systems",
};

const studentSchema = z.object({
  studentId: z.string().min(1, "Please generate a student ID"),
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .regex(/^[A-Za-z\s'-]+$/, "First name contains invalid characters"),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .regex(/^[A-Za-z\s'-]+$/, "Last name contains invalid characters"),
  address: z
    .string()
    .trim()
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address must not exceed 200 characters"),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .transform((val) => new Date(val))
    .refine((date) => date < new Date(), {
      message: "Date of birth must be in the past",
    })
    .refine(
      (date) => {
        const age = new Date().getFullYear() - date.getFullYear();
        return age >= 15 && age <= 100;
      },
      { message: "Student age must be between 15 and 100" },
    ),
  email: z.string().min(1, "Please generate a student email"),
  intake: IntakeEnum,
  degree: DegreeEnum,
});

async function fetchNextSequence(intake: string, degree: string) {
  const res = await fetch(
    `/api/students/next-sequence?intake=${intake}&degree=${degree}`,
  );
  if (!res.ok) throw new Error("Failed to fetch sequence");
  const { data } = await res.json();
  return data as { studentId: string; email: string; sequence: number };
}

export default function StudentRegisterForm() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      studentId: "",
      firstName: "",
      lastName: "",
      address: "",
      email: "",
      dob: "",
      intake: "",
      degree: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });
        if (!res.ok) {
          const { error } = await res.json();
          toast.error(error ?? "Failed to register student");
          return;
        }
        toast.success("Student registered successfully");
        router.push("/students");
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    },
    validators: { onSubmit: studentSchema, onBlur: studentSchema },
  });

  async function handleGenerate() {
    const intake = form.getFieldValue("intake");
    const degree = form.getFieldValue("degree");
    if (!intake || !degree) {
      toast.error("Please select both intake and degree first");
      return;
    }
    try {
      const { studentId, email } = await fetchNextSequence(intake, degree);
      form.setFieldValue("studentId", studentId);
      form.setFieldValue("email", email);
    } catch {
      toast.error("Failed to generate student ID. Please try again.");
    }
  }

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
        <form.Field
          name="firstName"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Kasun"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="lastName"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Weerasingha"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="address"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="No. 458, Hill Street, Gampaha"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="dob"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Date of Birth</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id={field.name}
                    type="date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
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
        <div className="flex gap-4">
          <form.Field
            name="degree"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field className="flex-1">
                  <FieldLabel htmlFor={field.name}>Degree</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => {
                      field.handleChange(val);
                      form.setFieldValue("studentId", "");
                      form.setFieldValue("email", "");
                    }}
                  >
                    <SelectTrigger onBlur={field.handleBlur}>
                      <SelectValue placeholder="Select degree" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {DegreeEnum.options.map((degree) => (
                          <SelectItem key={degree} value={degree}>
                            {DEGREE_LABELS[degree]}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="intake"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field className="flex-1">
                  <FieldLabel htmlFor={field.name}>Intake</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => {
                      field.handleChange(val);
                      form.setFieldValue("studentId", "");
                      form.setFieldValue("email", "");
                    }}
                  >
                    <SelectTrigger onBlur={field.handleBlur}>
                      <SelectValue placeholder="Select intake" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {IntakeEnum.options.map((intake) => (
                          <SelectItem key={intake} value={intake}>
                            Intake {intake}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </div>
        <form.Field
          name="studentId"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Student ID</FieldLabel>
                <div className="flex gap-4">
                  <Input
                    readOnly
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    placeholder="41/SE/0032"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerate}
                  >
                    Generate
                  </Button>
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="email"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Student Email</FieldLabel>
                <Input
                  readOnly
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  placeholder="41-se-0032@kdu.ac.lk"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>
      <Button type="submit" className="w-full mt-12">
        Register Student
      </Button>
    </form>
  );
}
