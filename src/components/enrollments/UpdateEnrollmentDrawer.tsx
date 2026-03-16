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
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type EnrollmentRow = {
  id: number;
  status: "ACTIVE" | "DROPPED" | "COMPLETED";
  student: { firstName: string; lastName: string; studentId: string };
  course: { name: string; code: string };
};

type UpdateEnrollmentDrawerProps = {
  enrollment: EnrollmentRow;
  action: "DROPPED" | "COMPLETED";
};

const ACTION_CONFIG = {
  DROPPED: {
    label: "Drop Enrollment",
    description:
      "The student will be removed from this course. This cannot be undone.",
    buttonLabel: "Yes, drop enrollment",
    buttonClass: "bg-orange-500 hover:bg-orange-600 text-white",
    successMsg: "Enrollment dropped",
  },
  COMPLETED: {
    label: "Mark as Completed",
    description:
      "This will mark the enrollment as completed. This cannot be undone.",
    buttonLabel: "Yes, mark as completed",
    buttonClass: "",
    successMsg: "Enrollment marked as completed",
  },
};

export function UpdateEnrollmentDrawer({
  enrollment,
  action,
}: UpdateEnrollmentDrawerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const config = ACTION_CONFIG[action];

  async function handleUpdate() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/enrollments/${enrollment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error ?? "Failed to update enrollment");
        return;
      }

      toast.success(config.successMsg);
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={
            action === "DROPPED"
              ? "text-orange-500 hover:text-orange-600 hover:border-orange-300"
              : ""
          }
        >
          {config.label}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{config.label}</DrawerTitle>
            <DrawerDescription>
              <span className="font-semibold text-foreground">
                {enrollment.student.firstName} {enrollment.student.lastName}
              </span>{" "}
              — {enrollment.course.name} ({enrollment.course.code})
              <br />
              <span className="mt-1 block">{config.description}</span>
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button
              onClick={handleUpdate}
              disabled={isLoading}
              className={config.buttonClass}
              variant={action === "COMPLETED" ? "default" : "outline"}
            >
              {isLoading && <Loader2 className="animate-spin" />}
              {isLoading ? "Updating..." : config.buttonLabel}
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