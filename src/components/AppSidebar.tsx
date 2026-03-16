"use client";

import { signOut } from "@/src/services/auth/auth.actions";
import type { Session } from "@/src/services/auth/auth.types";
import { BookOpen, ChevronUp, LogOut, Logs, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar";

const items = [
  {
    title: "Students",
    url: "/students",
    icon: User,
  },
  {
    title: "Courses",
    url: "/courses",
    icon: BookOpen,
  },
  { 
    title: "Enrollments", 
    url: "/enrollments", 
    icon: BookOpen 
  },
  {
    title: "Audit Logs",
    url: "/audit-logs",
    icon: Logs,
  },
];

export default function AppSidebar({ session }: { session: Session | null }) {
  const pathname = usePathname();

  const linkStyle = (path: string) =>
    `block px-4 py-2 rounded ${
      pathname === path
        ? "bg-sidebar-accent text-foreground font-semibold"
        : "text-muted-foreground"
    }`;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 flex justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={"/"} className="py-4">
                <Image
                  src={"/logo.svg"}
                  alt="logo"
                  width={28}
                  height={28}
                  className="rounded-xs"
                />
                <span className="text-xl font-bold">Atlas</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator className="m-0" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.slice(0, 3).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className={linkStyle(item.url)}>
                      <item.icon
                        strokeWidth={pathname === item.url ? 2.75 : 2}
                      />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tracking</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.slice(3).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className={linkStyle(item.url)}>
                      <item.icon
                        strokeWidth={pathname === item.url ? 2.75 : 2}
                      />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size={"lg"}>
                  <Avatar className="rounded-xs">
                    <AvatarFallback className="bg-primary/10 rounded-sm">
                      {session?.user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span>{session?.user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {session?.user.email}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  variant="destructive"
                  onClick={async () => await signOut()}
                >
                  <LogOut />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
