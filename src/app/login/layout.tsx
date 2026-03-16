import { ModeToggle } from "@/src/components/ModeToggle";
import { ThemeProvider } from "@/src/components/providers/ThemeProvider";
import { Metadata } from "next";
import { Bricolage_Grotesque, Geist_Mono } from "next/font/google";
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
          <main className="w-full">
            <div className="fixed top-4 right-4">
              <ModeToggle />
            </div>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
