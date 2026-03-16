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
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as z from "zod";

const DegreeEnum = z.enum(["BCS", "BSE", "BCE", "DBA", "BIT", "BIS"]);
const IntakeEnum = z.enum(["40", "41", "42", "43"]);

const DEGREE_LABELS: Record<z.infer<typeof DegreeEnum>, string> = {
  BCS: "BSc Computer Science",
  BSE: "BSc Software Engineering",
  BCE: "BSc Computer Engineering",
  DBA: "Bsc Data Science & Business Analytics",
  BIT: "BSc Information Technology",
  BIS: "BSc Information Systems",
};

const editStudentSchema = z.object({
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

  intake: IntakeEnum,
  degree: DegreeEnum,
});

type EditStudentFormProps = {
  student: Student;
};

export default function EditStudentForm({ student }: EditStudentFormProps) {
  const router = useRouter();

  // Convert stored DateTime to YYYY-MM-DD for the date input
  const dobValue = student.dob
    ? new Date(student.dob).toISOString().split("T")[0]
    : "";

  // Convert "INTAKE_41" → "41" for the Select
  const intakeValue = student.intake.replace("INTAKE_", "") as z.infer<
    typeof IntakeEnum
  >;

  const form = useForm({
    defaultValues: {
      firstName: student.firstName,
      lastName: student.lastName,
      address: student.address,
      dob: dobValue,
      intake: intakeValue,
      degree: student.degree as z.infer<typeof DegreeEnum>,
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await fetch(`/api/students/${student.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });

        if (!res.ok) {
          const { error } = await res.json();
          toast.error(error ?? "Failed to update student");
          return;
        }

        toast.success("Student updated successfully");
        router.push("/students");
        router.refresh();
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    },
    validators: {
      onSubmit: editStudentSchema,
      onBlur: editStudentSchema,
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
        {/* Student ID — read only, cannot be changed */}
        <Field>
          <FieldLabel>Student ID</FieldLabel>
          <Input readOnly value={student.studentId} className="opacity-50" />
        </Field>

        {/* Email — read only, tied to student ID */}
        <Field>
          <FieldLabel>Student Email</FieldLabel>
          <Input readOnly value={student.email} className="opacity-50" />
        </Field>

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
                    onValueChange={(val) =>
                      field.handleChange(val as z.infer<typeof DegreeEnum>)
                    }
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
                    onValueChange={(val) =>
                      field.handleChange(val as z.infer<typeof IntakeEnum>)
                    }
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