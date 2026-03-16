import AppSidebar from "@/src/components/AppSidebar";
import Navbar from "@/src/components/Navbar";
import { ThemeProvider } from "@/src/components/providers/ThemeProvider";
import { SidebarProvider } from "@/src/components/ui/sidebar";
import { auth } from "@/src/services/auth";
import { Metadata } from "next";
import { Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import { cookies, headers } from "next/headers";
import { Toaster } from "react-hot-toast";
import "../globals.css";

const bricolage = Bricolage_Grotesque();

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Atlas - Student Management System",
    template: "%s | Atlas",
  },
  description:
    "A centralized platform for managing student records, course registrations, and audit logs at KDU.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bricolage.className} ${geistMono.variable} antialiased flex bg-primary-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar session={session} />
            <main className="w-full">
              <Navbar />
              <div className="p-8">{children}</div>
            </main>
            <Toaster />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
