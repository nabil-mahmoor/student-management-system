import { auth } from "@/src/services/auth";
import StudentRegisterForm from "@/src/components/students/StudentRegisterForm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function StudentRegisterPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="space-y-8 sm:space-y-20">
      <h1 className="text-start sm:text-center font-bold text-2xl sm:text-4xl">
        Register Student
      </h1>
      <StudentRegisterForm />
    </div>
  );
}
