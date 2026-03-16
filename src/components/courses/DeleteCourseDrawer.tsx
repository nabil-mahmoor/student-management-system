"use client";

import { Button } from "@/src/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/src/components/ui/drawer";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type DeleteCourseDrawerProps = {
  course: Course;
};

export function DeleteCourseDrawer({ course }: DeleteCourseDrawerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const { error } = await res.json();
        // Surface the enrollment guard error cleanly
        toast.error(error ?? "Failed to delete course");
        return;
      }

      toast.success(`${course.name} deleted`);
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 text-red-500 hover:text-red-600 hover:border-red-300"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete {course.name}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Delete Course</DrawerTitle>
            <DrawerDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {course.name}
              </span>{" "}
              ({course.code})? This action cannot be undone.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="animate-spin" />}
              {isDeleting ? "Deleting..." : "Yes, delete course"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}