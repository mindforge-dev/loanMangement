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
import { useTransactions } from "../../../hooks/useTransactions";
import { useBorrowers } from "../../../hooks/useBorrowers";
import { transactionColumns } from "./columns";
import type { TransactionTableRow } from "./columns";
import ServerPagination from "./ServerPagination";
import TransactionFormModal from "./TransactionFormModal";
import Notification from "../../../components/Notification";

function Payments() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
    data: transactionsResponse,
    isLoading,
    error,
  } = useTransactions({ page, limit });
  const { data: borrowersResponse } = useBorrowers({ page: 1, limit: 1000 });

  const borrowers = useMemo(
    () => borrowersResponse?.data || [],
    [borrowersResponse],
  );
  const transactions = useMemo(
    () => transactionsResponse?.data || [],
    [transactionsResponse],
  );
  const meta = transactionsResponse?.meta;

  const borrowerNameMap = useMemo(() => {
    const map = new Map<string, string>();

    borrowers.forEach((borrower) => {
      map.set(borrower.id, borrower.full_name);
    });

    return map;
  }, [borrowers]);

  const transactionRows = useMemo<TransactionTableRow[]>(() => {
    return transactions.map((transaction) => ({
      ...transaction,
      borrower_name:
        borrowerNameMap.get(transaction.borrower_id) || "Unknown Borrower",
    }));
  }, [transactions, borrowerNameMap]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const handleAddTransaction = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: transactionRows,
    columns: transactionColumns,
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
    manualPagination: false,
  });

  return (
    <>
      <div className="space-y-6">
        <TableToolbar
          table={table}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          title="Transactions"
          description="Track and manage loan transactions"
          addButtonText="+ Add Transaction"
          onAddClick={handleAddTransaction}
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
              Error loading transactions: {error.message}
            </div>
          )}
          <DataTable table={table} isLoading={isLoading} />
          {!isLoading && transactionRows.length === 0 && (
            <div className="bg-white border border-t-0 border-gray-200 rounded-b-xl p-6 text-center text-sm text-gray-500">
              No transactions found.
            </div>
          )}
          <ServerPagination
            meta={meta}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </div>
      </div>

      <TransactionFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setNotification({
            message: "Transaction created successfully!",
            type: "success",
            isVisible: true,
          });
        }}
      />

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />
    </>
  );
}

export default Payments;
