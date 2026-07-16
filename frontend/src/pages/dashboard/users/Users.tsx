import { useMemo, useState, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table";
import { DataTable, Pagination, TableToolbar } from "../../../components/table";
import { useUsers, useDeleteUser } from "../../../hooks/useUsers";
import { useHasPermission } from "../../../hooks/useAuth";
import { Permissions } from "../../../lib/permissions";
import type { User } from "../../../services/userService";
import UserAccessModal from "./UserAccessModal";

const columnHelper = createColumnHelper<User>();

function Users() {
  const { data: users = [], isLoading, error } = useUsers();
  const deleteUserMutation = useDeleteUser();
  const canManage = useHasPermission(Permissions.USERS_MANAGE);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [accessUser, setAccessUser] = useState<User | null>(null);
  const [showAccess, setShowAccess] = useState(false);

  const handleManage = useCallback((user: User) => {
    setAccessUser(user);
    setShowAccess(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (confirm("Are you sure you want to delete this user?")) {
        try {
          await deleteUserMutation.mutateAsync(id);
        } catch (err) {
          console.error("Failed to delete user:", err);
        }
      }
    },
    [deleteUserMutation],
  );

  const handleAddUser = useCallback(() => {
    console.log("Add new user");
    // TODO: Implement add user functionality with a modal
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
          <div className="text-sm font-medium text-gray-900">
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => (
          <div className="text-sm text-gray-600">{info.getValue()}</div>
        ),
      }),
      columnHelper.accessor("roles", {
        header: "Roles",
        cell: (info) => (
          <div className="flex flex-wrap gap-1">
            {(info.getValue() ?? []).map((role: string) => (
              <span
                key={role}
                className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
              >
                {role}
              </span>
            ))}
          </div>
        ),
      }),
      columnHelper.display({
        id: "status",
        header: "Status",
        cell: () => (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Active
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="text-sm font-medium space-x-2">
            {canManage && (
              <button
                onClick={() => handleManage(info.row.original)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                Manage
              </button>
            )}
            <button
              onClick={() => handleDelete(info.row.original.id)}
              className="text-red-600 hover:text-red-900"
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        ),
      }),
    ],
    [canManage, handleManage, handleDelete, deleteUserMutation.isPending],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-6">
      <TableToolbar
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        title="Users"
        description="Manage your system users"
        addButtonText="+ Add User"
        onAddClick={handleAddUser}
      />

      <div>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Error loading users: {error.message}
          </div>
        )}
        <DataTable table={table} isLoading={isLoading} />
        {!isLoading && users.length === 0 && (
          <div className="bg-white border border-t-0 border-gray-200 rounded-b-xl p-6 text-center text-sm text-gray-500">
            No users found.
          </div>
        )}
        <Pagination table={table} />
      </div>

      <UserAccessModal
        user={accessUser}
        isOpen={showAccess}
        onClose={() => setShowAccess(false)}
      />
    </div>
  );
}

export default Users;
