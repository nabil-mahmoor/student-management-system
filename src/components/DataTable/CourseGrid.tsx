"use client";

import { DataTablePagination } from "@/src/components/DataTablePagination";
import SearchBar from "@/src/components/SearchBar";
import { Badge } from "@/src/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "lucide-react";
import Image from "next/image";
import { useDataTable } from "./useDataTable";

interface CourseGridProps {
  columns: ColumnDef<Course, any>[];
  data: Course[];
}

export function CourseGrid({ columns, data }: CourseGridProps) {
  const { table, globalFilter, setGlobalFilter } = useDataTable({
    data,
    columns,
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      <SearchBar
        value={globalFilter ?? ""}
        onChange={(e) => table.setGlobalFilter(String(e.target.value))}
      />

      {/* Course cards */}
      <div className="overflow-hidden space-y-4">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const course = row.original;
            return (
              <div
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="rounded-md p-4 border bg-white/70 hover:bg-white dark:bg-muted-foreground/5 dark:hover:bg-muted-foreground/10 cursor-pointer transition-all ease-in-out"
              >
                <div className="flex flex-col md:flex-row gap-8 relative">
                  {/* Course image */}
                  <div className="relative w-full md:w-60 aspect-video">
                    <Image
                      src={course.imageUrl}
                      alt={course.name}
                      fill
                      className="rounded-sm object-cover"
                    />
                  </div>

                  {/* Course details */}
                  <div className="flex flex-col flex-1 gap-4">
                    <h2 className="text-[1.7rem] font-semibold md:mr-20">
                      {course.name}
                    </h2>
                    <p className="text-muted-foreground flex-1">
                      {course.description}
                    </p>
                    <div className="items-baseline space-x-1 space-y-1">
                      {course.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="capitalize text-sm"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Course code + enrolled count */}
                  <>
                    <Badge
                      variant="secondary"
                      className="md:bg-transparent md:text-muted-foreground border-secondary/20 md:border-border md:border md:shadow-none text-sm font-semibold absolute top-2 right-2 md:right-0"
                    >
                      {course.code}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="md:bg-transparent md:text-muted-foreground border-secondary/20 md:border-border md:border md:shadow-none text-sm absolute top-2 left-2 md:inset-auto md:right-0 md:bottom-0"
                    >
                      <User strokeWidth={3} />
                      {course.enrolled}
                    </Badge>
                  </>
                </div>
              </div>
            );
          })
        ) : (
          <div className="w-full flex items-center justify-center border rounded-md h-30 text-muted-foreground">
            No courses found.
          </div>
        )}
      </div>

      {/* Pagination */}
      <DataTablePagination table={table} displayRowSelected={false} />
    </div>
  );
}
