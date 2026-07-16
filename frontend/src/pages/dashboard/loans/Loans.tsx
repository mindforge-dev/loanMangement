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
import {
  useLoans,
  useDeleteLoan,
  useUpdateLoanStatus,
} from "../../../hooks/useLoans";
import { useBorrowers } from "../../../hooks/useBorrowers";
import type { Loan } from "../../../services/loanService";
import { createLoanColumns } from "./columns";
import CreateLoan from "./createLoans/CreateLoan";
import ServerPagination from "./ServerPagination";
import Notification from "../../../components/Notification";
import { useDebounce } from "../../../hooks/useDebounce";

function Loans() {
  // State for pagination and filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<string>("");
  const [loanType, setLoanType] = useState<string>("");
  const [borrowerFullName, setBorrowerFullName] = useState<string>("");
  const [principalAmountGte, setPrincipalAmountGte] = useState<
    number | undefined
  >(undefined);
  const [principalAmountLte, setPrincipalAmountLte] = useState<
    number | undefined
  >(undefined);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  // Debounce borrower name search
  const debouncedBorrowerName = useDebounce(borrowerFullName, 500);

  // Notification state
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
    data: loansResponse,
    isLoading,
    error,
  } = useLoans({
    page,
    limit,
    status: status || undefined,
    loan_type: loanType || undefined,
    borrower_full_name: debouncedBorrowerName || undefined,
    principal_amount_gte: principalAmountGte,
    principal_amount_lte: principalAmountLte,
  });

  const deleteLoanMutation = useDeleteLoan();
  const updateStatusMutation = useUpdateLoanStatus();

  // Fetch borrowers for filter dropdown (if needed, though borrower_full_name is a string search)
  const { data: borrowersResponse } = useBorrowers({ page: 1, limit: 1000 });
  const borrowers = useMemo(
    () => borrowersResponse?.data || [],
    [borrowersResponse],
  );

  // Create borrower lookup map
  const borrowerMap = useMemo(() => {
    const map = new Map<
      string,
      { id: string; full_name: string; email: string; phone: string }
    >();
    borrowers.forEach((borrower) => {
      map.set(borrower.id, {
        id: borrower.id,
        full_name: borrower.full_name,
        email: borrower.email,
        phone: borrower.phone,
      });
    });
    return map;
  }, [borrowers]);

  // Extract loans and meta from paginated response
  const rawLoans = useMemo(() => loansResponse?.data || [], [loansResponse]);
  const meta = loansResponse?.meta;

  // Enrich loans with borrower data if not already populated
  const loans = useMemo(() => {
    return rawLoans.map((loan) => ({
      ...loan,
      borrower: loan.borrower || borrowerMap.get(loan.borrower_id),
    }));
  }, [rawLoans, borrowerMap]);

  const handleEdit = useCallback((loan: Loan) => {
    setSelectedLoan(loan);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (confirm("Are you sure you want to delete this loan?")) {
        try {
          await deleteLoanMutation.mutateAsync(id);
        } catch (error) {
          console.error("Failed to delete loan:", error);
        }
      }
    },
    [deleteLoanMutation],
  );

  const handleStatusChange = useCallback(
    async (id: string, status: Loan["status"]) => {
      try {
        await updateStatusMutation.mutateAsync({ id, status });
        setNotification({
          message: `Loan status updated to ${status} successfully!`,
          type: "success",
          isVisible: true,
        });
      } catch (error) {
        console.error("Failed to update loan status:", error);
        setNotification({
          message: "Failed to update loan status. Please try again.",
          type: "error",
          isVisible: true,
        });
      }
    },
    [updateStatusMutation],
  );

  const handleAddLoan = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedLoan(null);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setStatus("");
    setLoanType("");
    setBorrowerFullName("");
    setPrincipalAmountGte(undefined);
    setPrincipalAmountLte(undefined);
    setPage(1);
  }, []);

  const columns = useMemo(
    () =>
      createLoanColumns(
        handleEdit,
        handleDelete,
        handleStatusChange,
        deleteLoanMutation.isPending,
      ),
    [
      handleEdit,
      handleDelete,
      handleStatusChange,
      deleteLoanMutation.isPending,
    ],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: loans,
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
    manualPagination: true,
  });

  return (
    <>
      <div className="space-y-6">
        <TableToolbar
          table={table}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          title="Loans"
          description="Manage loan applications and approvals"
          addButtonText="+ Add Loan"
          onAddClick={handleAddLoan}
        />

        {/* Advanced Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <h3 className="font-semibold text-gray-800">Advanced Filters</h3>
            </div>
            <button
              onClick={handleClearFilters}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Borrower Search */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Borrower Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search by borrower name..."
                    value={borrowerFullName}
                    onChange={(e) => {
                      setBorrowerFullName(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm appearance-none bg-white"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="DEFAULTED">Defaulted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {/* Loan Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Loan Type
                </label>
                <select
                  value={loanType}
                  onChange={(e) => {
                    setLoanType(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm appearance-none bg-white"
                >
                  <option value="">All Types</option>
                  <option value="PERSONAL">Personal</option>
                  <option value="HOME">Home</option>
                  <option value="AUTO">Auto</option>
                  <option value="BUSINESS">Business</option>
                  <option value="EDUCATION">Education</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Principal Amount Range */}
              <div className="lg:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Principal Amount Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="Min Amount"
                      value={principalAmountGte ?? ""}
                      onChange={(e) => {
                        setPrincipalAmountGte(
                          e.target.value ? Number(e.target.value) : undefined,
                        );
                        setPage(1);
                      }}
                      className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="Max Amount"
                      value={principalAmountLte ?? ""}
                      onChange={(e) => {
                        setPrincipalAmountLte(
                          e.target.value ? Number(e.target.value) : undefined,
                        );
                        setPage(1);
                      }}
                      className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
              Error loading loans: {error.message}
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

      <CreateLoan
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(mode) => {
          setNotification({
            message:
              mode === "create"
                ? "Loan created successfully!"
                : "Loan updated successfully!",
            type: "success",
            isVisible: true,
          });
        }}
      />

      <CreateLoan
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        mode="edit"
        loanId={selectedLoan?.id}
        initialData={
          selectedLoan
            ? {
                borrower_id: selectedLoan.borrower_id,
                interest_rate_id: selectedLoan.interest_rate_id,
                principal_amount: selectedLoan.principal_amount,
                loan_type: selectedLoan.loan_type,
                start_date: selectedLoan.start_date,
                term_months: selectedLoan.term_months,
              }
            : undefined
        }
        onSuccess={(mode) => {
          setNotification({
            message:
              mode === "create"
                ? "Loan created successfully!"
                : "Loan updated successfully!",
            type: "success",
            isVisible: true,
          });
        }}
      />

      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />
    </>
  );
}

export default Loans;
