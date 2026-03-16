import Image from "next/image";
import LoginForm from "@/src/components/login/LoginForm";
import { headers } from "next/headers";
import { auth } from "@/src/services/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect("/students");
  }

  return (
    <div className="flex w-full h-dvh p-8">
      <div className="flex-1 my-auto">
        <div className="max-w-md mx-auto space-y-16 md:border md:px-8 md:py-16 rounded-2xl md:shadow-md">
          <h1 className="text-4xl font-bold text-center">Welcome Back</h1>
          <LoginForm />
        </div>
      </div>
      <div className="flex items-center gap-2 absolute bottom-12 left-[50%] translate-x-[-50%]">
        <Image
          src={"/logo-light.svg"}
          alt="logo"
          width={28}
          height={28}
          className="rounded-xs"
        />
        <span className="text-2xl font-semibold">Atlas</span>
      </div>
    </div>
  );
}
