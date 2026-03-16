"use client";

import { DataTablePagination } from "@/src/components/DataTablePagination";
import SearchBar from "@/src/components/SearchBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { useDataTable } from "@/src/components/DataTable/useDataTable";
import { columns, type EnrollmentRow } from "./EnrollmentColumns";

interface EnrollmentTableProps {
  data: EnrollmentRow[];
}

export function EnrollmentTable({ data }: EnrollmentTableProps) {
  const { table, globalFilter, setGlobalFilter } = useDataTable({
    data,
    columns,
    enableSorting: true,
  });

  return (
    <div className="space-y-4">
      <SearchBar
        value={globalFilter ?? ""}
        onChange={(e) => table.setGlobalFilter(String(e.target.value))}
      />

      <div className="overflow-hidden rounded-md border">
        <Table className="bg-white/70 hover:bg-white dark:bg-muted-foreground/5 dark:hover:bg-muted-foreground/10">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No enrollments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} displayRowSelected={false} />
    </div>
  );
}