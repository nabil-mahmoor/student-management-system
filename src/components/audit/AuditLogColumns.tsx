"use client";

import { Badge } from "@/src/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/src/components/DataTableColumnHeader";

export type AuditLogRow = {
  id: number;
  action: "CREATE" | "UPDATE" | "DELETE";
  entity: "STUDENT" | "COURSE" | "ENROLLMENT";
  entityId: number;
  changes: Record<string, any> | null;
  performedBy: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

const ACTION_STYLES: Record<AuditLogRow["action"], string> = {
  CREATE:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  UPDATE: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const ENTITY_STYLES: Record<AuditLogRow["entity"], string> = {
  STUDENT:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  COURSE:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  ENROLLMENT:
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
};

export const columns: ColumnDef<AuditLogRow>[] = [
  {
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => (
      <Badge className={ACTION_STYLES[row.original.action]}>
        {row.original.action}
      </Badge>
    ),
  },
  {
    accessorKey: "entity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Entity" />
    ),
    cell: ({ row }) => (
      <Badge className={ENTITY_STYLES[row.original.entity]}>
        {row.original.entity}
      </Badge>
    ),
  },
  {
    accessorKey: "entityId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Entity ID" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-sm">
        #{row.original.entityId}
      </span>
    ),
  },
  {
    accessorKey: "user",
    header: "Performed By",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.user.name}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.user.email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "changes",
    header: "Changes",
    cell: ({ row }) => {
      const changes = row.original.changes;
      if (!changes)
        return <span className="text-muted-foreground text-sm">—</span>;

      // For UPDATE show the changed fields only
      // For CREATE/DELETE show a summary
      if (changes.before && changes.after) {
        const changedFields = Object.keys(changes.after).filter(
          (key) =>
            JSON.stringify(changes.before[key]) !==
            JSON.stringify(changes.after[key]),
        );
        return (
          <span className="text-sm text-muted-foreground">
            Updated: {changedFields.join(", ")}
          </span>
        );
      }

      if (changes.after) {
        return (
          <span className="text-sm text-muted-foreground">
            New record created
          </span>
        );
      }

      if (changes.before) {
        return (
          <span className="text-sm text-muted-foreground">Record deleted</span>
        );
      }

      return <span className="text-muted-foreground text-sm">—</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Timestamp" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
        <span className="text-xs text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleTimeString()}
        </span>
      </div>
    ),
  },
];