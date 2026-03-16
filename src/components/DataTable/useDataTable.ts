"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";

type UseDataTableOptions<TData> = {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  enableSorting?: boolean;
  enableColumnVisibility?: boolean;
};

export function useDataTable<TData>({
  data,
  columns,
  enableSorting = false,
  enableColumnVisibility = false,
}: UseDataTableOptions<TData>) {
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
    ...(enableSorting && {
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
    }),
    ...(enableColumnVisibility && {
      onColumnVisibilityChange: setColumnVisibility,
      onColumnFiltersChange: setColumnFilters,
    }),
    state: {
      globalFilter,
      rowSelection,
      ...(enableSorting && { sorting }),
      ...(enableColumnVisibility && { columnVisibility, columnFilters }),
    },
  });

  return { table, globalFilter, setGlobalFilter };
}