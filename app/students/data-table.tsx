"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "@/components/DataTablePagination";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Columns3 } from "lucide-react";
import { useState } from "react";
import { columnHeaders } from "./columns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
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
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
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
      <div className="flex items-center justify-between py-2 gap-4">
        <SearchBar
          value={globalFilter ?? ""}
          onChange={(e) => table.setGlobalFilter(String(e.target.value))}
        />

        {/* <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Funnel />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent align="center">
              <PopoverHeader>
                <PopoverTitle>Filters</PopoverTitle>
              </PopoverHeader>
              <div className="space-y-4 mt-4">
                <div className="flex justify-between items-center gap-2">
                  <div className="flex-1">
                    <span className="block text-sm text-muted-foreground">
                      Select intake
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          Intake
                          <ChevronDown />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {intakeOptions.map((intake) => (
                          <DropdownMenuCheckboxItem
                            key={intake.value}
                            // checked={table}
                            onCheckedChange={(value) =>
                              table.getColumn("intake")?.setFilterValue(value)
                            }
                            defaultValue={table.getColumn("intake")?.getFilterValue() as string}
                          >
                            {intake.label}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Select
                      defaultValue="all"
                      value={intakeSelected}
                      onValueChange={setIntakeSelected}
                    >
                      <SelectTrigger className="w-full max-sm">
                        <SelectValue placeholder="Select intake" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Intake</SelectLabel>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="40">40</SelectItem>
                          <SelectItem value="41">41</SelectItem>
                          <SelectItem value="42">42</SelectItem>
                          <SelectItem value="43">43</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-muted-foreground">
                      Select degree
                    </span>
                    <Select
                      defaultValue="all"
                      value={degreeSelected}
                      onValueChange={setDegreeSelected}
                    >
                      <SelectTrigger className="w-full max-sm">
                        <SelectValue placeholder="Select degree" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Degree</SelectLabel>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="CS">CS</SelectItem>
                          <SelectItem value="SE">SE</SelectItem>
                          <SelectItem value="CE">CE</SelectItem>
                          <SelectItem value="DBA">DBA</SelectItem>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="IS">IS</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    size={"sm"}
                    onClick={() => {
                      table.getColumn("intake")?.setFilterValue(intakeSelected);
                      // table.getColumn("degree") ?.setFilterValue(degreeSelected);
                      setIsOpen(false);
                    }}
                  >
                    Filter
                  </Button>
                  <Button
                    className="flex-1"
                    variant={"outline"}
                    size={"sm"}
                    onClick={() => {
                      setIntakeSelected("all");
                      setDegreeSelected("all");
                      setIsOpen(false);
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover> */}

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
              .slice(0, -1)
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {columnHeaders[column.id]}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
