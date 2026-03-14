"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { DataTablePagination } from "@/components/DataTablePagination";
import SearchBar from "@/components/SearchBar";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<Course, any>[];
  data: Course[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
  });

  return (
    <div className="space-y-4">
      <SearchBar
        value={globalFilter ?? ""}
        onChange={(e) => table.setGlobalFilter(String(e.target.value))}
      />

      <div className="overflow-hidden space-y-4">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className="rounded-md p-4 border hover bg-white/70 hover:bg-white dark:bg-muted-foreground/5 dark:hover:bg-muted-foreground/10 cursor-pointer transition-all ease-in-out"
            >
              <div className="flex flex-col md:flex-row gap-8 relative">
                <div className="relative w-full md:w-60 aspect-16/12">
                  <Image
                    src="https://i.pinimg.com/1200x/20/a4/71/20a471e8758f883006732aef6727d430.jpg"
                    alt={row.original.name}
                    fill
                    className="rounded-sm object-cover"
                  />
                </div>
                <div className="flex flex-col flex-1 gap-4">
                  <h2 className="text-[1.7rem] font-semibold md:mr-20">
                    {row.original.name}
                  </h2>
                  <p className="text-muted-foreground flex-1">
                    {row.original.description}
                  </p>
                  <div className="items-baseline space-x-1 space-y-1">
                    {row.original.tags.map((item) => (
                      <Badge
                        key={item}
                        variant={"secondary"}
                        className="capitalize text-sm"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                <>
                  <Badge
                    variant={"secondary"}
                    className="md:bg-transparent md:text-muted-foreground border-secondary/20 md:border-border md:border md:shadow-none text-sm font-semibold absolute top-2 right-2 md:right-0"
                  >
                    {row.original.code}
                  </Badge>
                  <Badge
                    variant={"secondary"}
                    className="md:bg-transparent md:text-muted-foreground border-secondary/20 md:border-border md:border md:shadow-none text-sm absolute top-2 left-2 md:inset-auto md:right-0 md:bottom-0"
                  >
                    <User strokeWidth={3} />
                    {row.original.enrolled}
                  </Badge>
                </>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full flex items-center justify-center border rounded-md h-30 text-muted-foreground">
            No results
          </div>
        )}
      </div>
      <DataTablePagination table={table} displayRowSelected={false} />
    </div>
  );
}
