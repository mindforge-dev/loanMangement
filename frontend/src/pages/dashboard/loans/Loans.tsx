import { useMemo, useState, useCallback } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from '@tanstack/react-table'
import type { SortingState, ColumnFiltersState } from '@tanstack/react-table'
import { DataTable, Pagination, TableToolbar } from '../../../components/table'
import { useLoans, useDeleteLoan } from '../../../hooks/useLoans'
import type { Loan } from '../../../services/loanService'
import { createLoanColumns } from './columns'
import CreateLoan from './createLoans/CreateLoan'

function Loans() {
    const { data: loans = [], isLoading, error } = useLoans()
    const deleteLoanMutation = useDeleteLoan()

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)

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

    const handleAddLoan = useCallback(() => {
        setIsCreateModalOpen(true)
    }, [])

    const handleCloseEditModal = useCallback(() => {
        setIsEditModalOpen(false)
        setSelectedLoan(null)
    }, [])

    const columns = useMemo(
        () => createLoanColumns(handleEdit, handleDelete, deleteLoanMutation.isPending),
        [handleEdit, handleDelete, deleteLoanMutation.isPending]
    )

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

                <div>
                    <DataTable table={table} />
                    <Pagination table={table} />
                </div>
            </div>

            <CreateLoan
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
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
            />
        </>
    )
}

export default Loans
