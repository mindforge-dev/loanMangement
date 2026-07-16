import { useMemo, useState, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table";
import { DataTable, TableToolbar } from "../../../components/table";
import { useBorrowers, useDeleteBorrower } from "../../../hooks/useBorrowers";
import type { Borrower } from "../../../services/borrowerService";
import { createBorrowerColumns } from "./columns";
import ServerPagination from "./ServerPagination";
import BorrowerFormModal from "./BorrowerFormModal";
import Notification from "../../../components/Notification";

function Borrowers() {
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(
    null,
  );
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const {
    data: borrowersResponse,
    isLoading,
    error,
  } = useBorrowers({ page, limit });
  const deleteBorrowerMutation = useDeleteBorrower();

  // Extract borrowers and meta from paginated response
  const borrowers = useMemo(
    () => borrowersResponse?.data || [],
    [borrowersResponse],
  );
  const meta = borrowersResponse?.meta;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const handleEdit = useCallback((borrower: Borrower) => {
    setSelectedBorrower(borrower);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (confirm("Are you sure you want to delete this borrower?")) {
        try {
          await deleteBorrowerMutation.mutateAsync(id);
        } catch (error) {
          console.error("Failed to delete borrower:", error);
        }
      }
    },
    [deleteBorrowerMutation],
  );

  const handleAddBorrower = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedBorrower(null);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, []);

  const columns = useMemo(
    () =>
      createBorrowerColumns(
        handleEdit,
        handleDelete,
        deleteBorrowerMutation.isPending,
      ),
    [handleEdit, handleDelete, deleteBorrowerMutation.isPending],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: borrowers,
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
    manualPagination: false, // Client-side pagination for filtered results
  });

  return (
    <>
      <div className="space-y-6">
        <TableToolbar
          table={table}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          title="Borrowers"
          description="Manage borrower information"
          addButtonText="+ Add Borrower"
          onAddClick={handleAddBorrower}
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
              Error loading borrowers: {error.message}
            </div>
          )}
          <DataTable table={table} isLoading={isLoading} />
          <ServerPagination
            meta={meta}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </div>
      </div>

      {isCreateModalOpen && (
        <BorrowerFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={(mode) => {
            setNotification({
              message:
                mode === "create"
                  ? "Borrower created successfully!"
                  : "Borrower updated successfully!",
              type: "success",
              isVisible: true,
            });
          }}
        />
      )}

      {isEditModalOpen && (
        <BorrowerFormModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          mode="edit"
          initialData={selectedBorrower}
          onSuccess={(mode) => {
            setNotification({
              message:
                mode === "create"
                  ? "Borrower created successfully!"
                  : "Borrower updated successfully!",
              type: "success",
              isVisible: true,
            });
          }}
        />
      )}

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />
    </>
  );
}

export default Borrowers;
