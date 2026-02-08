import { useMemo, useState, useCallback } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from '@tanstack/react-table'
import type { SortingState, ColumnFiltersState } from '@tanstack/react-table'
import { DataTable, TableToolbar } from '../../../components/table'
import { useLoans, useDeleteLoan, useUpdateLoanStatus } from '../../../hooks/useLoans'
import { useBorrowers } from '../../../hooks/useBorrowers'
import type { Loan } from '../../../services/loanService'
import { createLoanColumns } from './columns'
import CreateLoan from './createLoans/CreateLoan'
import ServerPagination from './ServerPagination'
import Notification from '../../../components/Notification'

function Loans() {
    // Pagination state
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [selectedBorrowerId, setSelectedBorrowerId] = useState<string>('')
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
    // Notification state
    const [notification, setNotification] = useState<{
        message: string
        type: 'success' | 'error' | 'info' | 'warning'
        isVisible: boolean
    }>({
        message: '',
        type: 'success',
        isVisible: false
    })

    const { data: loansResponse, isLoading, error } = useLoans({ page, limit })
    const deleteLoanMutation = useDeleteLoan()
    const updateStatusMutation = useUpdateLoanStatus()

    // Fetch borrowers for filter dropdown
    const { data: borrowersResponse } = useBorrowers({ page: 1, limit: 1000 })
    const borrowers = useMemo(() => borrowersResponse?.data || [], [borrowersResponse])

    // Create borrower lookup map
    const borrowerMap = useMemo(() => {
        const map = new Map<string, { id: string; full_name: string; email: string; phone: string }>()
        borrowers.forEach(borrower => {
            map.set(borrower.id, {
                id: borrower.id,
                full_name: borrower.full_name,
                email: borrower.email,
                phone: borrower.phone,
            })
        })
        return map
    }, [borrowers])

    // Extract loans and meta from paginated response
    const rawLoans = useMemo(() => loansResponse?.data || [], [loansResponse])
    const meta = loansResponse?.meta

    // Enrich loans with borrower data if not already populated
    const loans = useMemo(() => {
        return rawLoans.map(loan => ({
            ...loan,
            borrower: loan.borrower || borrowerMap.get(loan.borrower_id)
        }))
    }, [rawLoans, borrowerMap])



    const handleEdit = useCallback((loan: Loan) => {
        setSelectedLoan(loan)
        setIsEditModalOpen(true)
    }, [])

    const handleDelete = useCallback(async (id: string) => {
        if (confirm('Are you sure you want to delete this loan?')) {
            try {
                await deleteLoanMutation.mutateAsync(id)
            } catch (error) {
                console.error('Failed to delete loan:', error)
            }
        }
    }, [deleteLoanMutation])

    const handleStatusChange = useCallback(async (id: string, status: Loan['status']) => {
        try {
            await updateStatusMutation.mutateAsync({ id, status })
            setNotification({
                message: `Loan status updated to ${status} successfully!`,
                type: 'success',
                isVisible: true
            })
        } catch (error) {
            console.error('Failed to update loan status:', error)
            setNotification({
                message: 'Failed to update loan status. Please try again.',
                type: 'error',
                isVisible: true
            })
        }
    }, [updateStatusMutation])

    const handleAddLoan = useCallback(() => {
        setIsCreateModalOpen(true)
    }, [])

    const handleCloseEditModal = useCallback(() => {
        setIsEditModalOpen(false)
        setSelectedLoan(null)
    }, [])

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage)
    }, [])

    const handleLimitChange = useCallback((newLimit: number) => {
        setLimit(newLimit)
        setPage(1) // Reset to first page when changing limit
    }, [])

    const handleBorrowerFilterChange = useCallback((borrowerId: string) => {
        setSelectedBorrowerId(borrowerId)
    }, [])

    // Filter loans by selected borrower
    const filteredLoans = useMemo(() => {
        if (!selectedBorrowerId) return loans
        return loans.filter(loan => loan.borrower?.id === selectedBorrowerId)
    }, [loans, selectedBorrowerId])

    const columns = useMemo(
        () => createLoanColumns(handleEdit, handleDelete, handleStatusChange, deleteLoanMutation.isPending),
        [handleEdit, handleDelete, handleStatusChange, deleteLoanMutation.isPending]
    )

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data: filteredLoans,
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
    })

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <p className="text-gray-500">Loading loans...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <p className="text-red-500">Error loading loans: {error.message}</p>
                </div>
            </div>
        )
    }

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

                {/* Borrower Filter */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-4">
                        <label htmlFor="borrower-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                            Filter by Borrower:
                        </label>
                        <select
                            id="borrower-filter"
                            value={selectedBorrowerId}
                            onChange={(e) => handleBorrowerFilterChange(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Borrowers</option>
                            {borrowers.map((borrower) => (
                                <option key={borrower.id} value={borrower.id}>
                                    {borrower.full_name}
                                </option>
                            ))}
                        </select>
                        {selectedBorrowerId && (
                            <button
                                onClick={() => handleBorrowerFilterChange('')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Clear Filter
                            </button>
                        )}
                    </div>
                </div>

                <div>
                    <DataTable table={table} />
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
                        message: mode === 'create' ? 'Loan created successfully!' : 'Loan updated successfully!',
                        type: 'success',
                        isVisible: true
                    })
                }}
            />

            <CreateLoan
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                mode="edit"
                loanId={selectedLoan?.id}
                initialData={selectedLoan ? {
                    borrower_id: selectedLoan.borrower_id,
                    interest_rate_id: selectedLoan.interest_rate_id,
                    principal_amount: selectedLoan.principal_amount,
                    loan_type: selectedLoan.loan_type,
                    start_date: selectedLoan.start_date,
                    term_months: selectedLoan.term_months,
                } : undefined}
                onSuccess={(mode) => {
                    setNotification({
                        message: mode === 'create' ? 'Loan created successfully!' : 'Loan updated successfully!',
                        type: 'success',
                        isVisible: true
                    })
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
    )
}

export default Loans
