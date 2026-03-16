"use client";

import { ColumnDef } from "@tanstack/react-table";

// CourseColumns only defines the structure of each column.
// The CourseGrid component renders the full card layout —
// these column definitions exist so useReactTable can power
// filtering, pagination, and search on top of the card UI.
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
    accessorKey: "tags",
    header: "Tags",
    // Allow tag array to be searched via global filter
    filterFn: (row, _, filterValue) => {
      const tags: string[] = row.getValue("tags");
      return tags.some((tag) =>
        tag.toLowerCase().includes(filterValue.toLowerCase()),
      );
    },
  },
  {
    // enrolled is a derived count from the API (_count.enrollments)
    // it's not stored on the Course model directly
    accessorKey: "enrolled",
    header: "Enrolled",
  },
];
