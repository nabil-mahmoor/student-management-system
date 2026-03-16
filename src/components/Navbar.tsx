import { ModeToggle } from "./ModeToggle";
import { SidebarTrigger } from "./ui/sidebar";

export default function Navbar() {
  return <nav className="h-16 px-4 flex items-center justify-between bg-primary-foreground sticky top-0 z-50">
    <SidebarTrigger className="cursor-pointer" />
    <ModeToggle />
  </nav>;
}
