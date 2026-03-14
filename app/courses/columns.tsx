"use client";

import { ColumnDef } from "@tanstack/react-table";
import courseData from "./course-data.json";

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "enrolled",
    header: "Enrolled",
  },
  {
    accessorKey: "tags",
    header: "Tags",
  },
];

export const course: Course[] = courseData as Course[];
