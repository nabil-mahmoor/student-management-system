"use client";

import { DataTableColumnHeader } from "@/src/components/DataTableColumnHeader";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { toast } from "react-hot-toast";

// Column header display names — used by StudentTable's visibility dropdown
export const columnHeaders: Record<string, string> = {
  studentId: "Student ID",
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  intake: "Intake",
  degree: "Degree",
  dob: "DOB",
  address: "Address",
  actions: "Actions",
};

// Only column definitions live here — no data, no JSON imports
export const columns: ColumnDef<Student>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "studentId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnHeaders.studentId} />
    ),
    cell: ({ row }) => {
      const studentId = row.original.studentId;
      return (
        <div
          className="cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(studentId);
            toast.success("Copied ID", { position: "top-center" });
          }}
        >
          {row.getValue("studentId")}
        </div>
      );
    },
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnHeaders.firstName} />
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnHeaders.lastName} />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={columnHeaders.email} />
    ),
    cell: ({ row }) => {
      const studentEmail = row.original.email;
      return (
        <div
          className="text-blue-600 dark:text-blue-400 cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(studentEmail);
            toast.success("Copied Email", { position: "top-center" });
          }}
        >
          {row.getValue("email")}
        </div>
      );
    },
  },
  {
    accessorKey: "intake",
    header: () => (
      <div className="text-center font-bold">{columnHeaders.intake}</div>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("intake")}</div>
    ),
  },
  {
    accessorKey: "degree",
    header: () => (
      <div className="text-center font-bold">{columnHeaders.degree}</div>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("degree")}</div>
    ),
  },
  {
    accessorKey: "dob",
    header: () => (
      <div className="text-center font-bold">{columnHeaders.dob}</div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {new Date(row.getValue("dob")).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: () => <div className="font-bold">{columnHeaders.address}</div>,
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center font-bold">{columnHeaders.actions}</div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Button variant="outline" size="icon" className="h-8 w-8">
          <span className="sr-only">Edit student {row.original.studentId}</span>
          <Edit className="h-4 w-4 opacity-50" />
        </Button>
      </div>
    ),
  },
];