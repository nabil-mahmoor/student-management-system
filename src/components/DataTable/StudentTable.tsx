"use client";

import { DataTablePagination } from "@/src/components/DataTablePagination";
import SearchBar from "@/src/components/SearchBar";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { Columns3 } from "lucide-react";
import { useDataTable } from "./useDataTable";

// Column header display names — used in the visibility dropdown
const columnHeaders: Record<string, string> = {
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

interface StudentTableProps {
  columns: ColumnDef<Student, any>[];
  data: Student[];
}

export function StudentTable({ columns, data }: StudentTableProps) {
  const { table, globalFilter, setGlobalFilter } = useDataTable({
    data,
    columns,
    enableSorting: true,
    enableColumnVisibility: true,
  });

  return (
    <div className="space-y-4">
      {/* Toolbar: search + column visibility toggle */}
      <div className="flex items-center justify-between py-2 gap-4">
        <SearchBar
          value={globalFilter ?? ""}
          onChange={(e) => table.setGlobalFilter(String(e.target.value))}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Columns3 />
              <span className="hidden sm:block">Columns</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .slice(0, -1) // exclude the actions column
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {columnHeaders[column.id] ?? column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table className="shadow-md bg-white/70 hover:bg-white dark:bg-muted-foreground/5 dark:hover:bg-muted-foreground/10">
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination table={table} displayRowSelected={true} />
    </div>
  );
}