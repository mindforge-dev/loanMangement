import { useMemo, useState } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    createColumnHelper,
} from '@tanstack/react-table'
import type { SortingState, ColumnFiltersState } from '@tanstack/react-table'
import { DataTable, Pagination, TableToolbar } from '../../../components/table'
import { useLoans, useDeleteLoan } from '../../../hooks/useLoans'
import type { Loan } from '../../../services/loanService'

const columnHelper = createColumnHelper<Loan>()

function Loans() {
    const { data: loans = [], isLoading, error } = useLoans()
    const deleteLoanMutation = useDeleteLoan()

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(parseFloat(amount))
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    const columns = useMemo(
        () => [
            columnHelper.accessor('loan_type', {
                header: 'Loan Type',
                cell: (info) => (
                    <div className="text-sm font-medium text-gray-900">{info.getValue()}</div>
                ),
            }),
            columnHelper.accessor('principal_amount', {
                header: 'Principal Amount',
                cell: (info) => (
                    <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(info.getValue())}
                    </div>
                ),
            }),
            columnHelper.accessor('current_balance', {
                header: 'Current Balance',
                cell: (info) => (
                    <div className="text-sm text-gray-600">
                        {formatCurrency(info.getValue())}
                    </div>
                ),
            }),
            columnHelper.accessor('interest_rate_snapshot', {
                header: 'Interest Rate',
                cell: (info) => (
                    <div className="text-sm text-gray-900">
                        {parseFloat(info.getValue()).toFixed(2)}%
                    </div>
                ),
            }),
            columnHelper.accessor('term_months', {
                header: 'Term',
                cell: (info) => (
                    <div className="text-sm text-gray-600">
                        {info.getValue()} months
                    </div>
                ),
            }),
            columnHelper.accessor('start_date', {
                header: 'Start Date',
                cell: (info) => (
                    <div className="text-sm text-gray-600">
                        {formatDate(info.getValue())}
                    </div>
                ),
            }),
            columnHelper.accessor('end_date', {
                header: 'End Date',
                cell: (info) => (
                    <div className="text-sm text-gray-600">
                        {formatDate(info.getValue())}
                    </div>
                ),
            }),
            columnHelper.accessor('status', {
                header: 'Status',
                cell: (info) => {
                    const status = info.getValue()
                    const statusColors = {
                        ACTIVE: 'bg-green-100 text-green-800',
                        PENDING: 'bg-yellow-100 text-yellow-800',
                        CLOSED: 'bg-gray-100 text-gray-800',
                        DEFAULTED: 'bg-red-100 text-red-800',
                    }
                    return (
                        <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'
                                }`}
                        >
                            {status}
                        </span>
                    )
                },
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Actions',
                cell: (info) => (
                    <div className="text-sm font-medium space-x-2">
                        <button
                            onClick={() => handleEdit(info.row.original)}
                            className="text-indigo-600 hover:text-indigo-900"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(info.row.original.id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={deleteLoanMutation.isPending}
                        >
                            Delete
                        </button>
                    </div>
                ),
            }),
        ],
        []
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

    const handleEdit = (loan: Loan) => {
        console.log('Edit loan:', loan)
        // TODO: Implement edit functionality
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this loan?')) {
            try {
                await deleteLoanMutation.mutateAsync(id)
            } catch (error) {
                console.error('Failed to delete loan:', error)
            }
        }
    }

    const handleAddLoan = () => {
        console.log('Add new loan')
        // TODO: Implement add loan functionality
    }

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
    )
}

export default Loans
