"use client";

import { UpdateEnrollmentDrawer } from "@/src/components/enrollments/UpdateEnrollmentDrawer";
import { Badge } from "@/src/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/src/components/DataTableColumnHeader";

export type EnrollmentRow = {
  id: number;
  status: "ACTIVE" | "DROPPED" | "COMPLETED";
  createdAt: string;
  student: {
    id: number;
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  course: {
    id: number;
    code: string;
    name: string;
  };
};

const STATUS_STYLES: Record<EnrollmentRow["status"], string> = {
  ACTIVE:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  DROPPED:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export const columns: ColumnDef<EnrollmentRow>[] = [
  {
    accessorKey: "student",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student" />
    ),
    cell: ({ row }) => {
      const { firstName, lastName, studentId } = row.original.student;
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {firstName} {lastName}
          </span>
          <span className="text-xs text-muted-foreground">{studentId}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "course",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Course" />
    ),
    cell: ({ row }) => {
      const { name, code } = row.original.course;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          <span className="text-xs text-muted-foreground">{code}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge className={STATUS_STYLES[row.original.status]}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Enrolled On" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center font-bold">Actions</div>,
    cell: ({ row }) => {
      const enrollment = row.original;

      // Terminal states — no actions available
      if (enrollment.status !== "ACTIVE") {
        return (
          <div className="flex justify-center">
            <span className="text-sm text-muted-foreground">—</span>
          </div>
        );
      }

      return (
        <div className="flex justify-center gap-2">
          <UpdateEnrollmentDrawer enrollment={enrollment} action="COMPLETED" />
          <UpdateEnrollmentDrawer enrollment={enrollment} action="DROPPED" />
        </div>
      );
    },
  },
];