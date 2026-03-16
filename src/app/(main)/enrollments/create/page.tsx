import CreateEnrollmentForm from "@/src/components/enrollments/CreateEnrollmentForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enroll Student",
};

export default function CreateEnrollmentPage() {
  return (
    <div className="space-y-8 sm:space-y-12">
      <div>
        <h1 className="font-bold text-2xl sm:text-4xl">Enroll Student</h1>
        <p className="text-muted-foreground mt-1">
          Assign a student to a course
        </p>
      </div>
      <CreateEnrollmentForm />
    </div>
  );
}