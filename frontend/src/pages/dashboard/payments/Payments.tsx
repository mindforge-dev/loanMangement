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
import { useTransactions } from '../../../hooks/useTransactions'
import { useBorrowers } from '../../../hooks/useBorrowers'
import { transactionColumns } from './columns'
import type { TransactionTableRow } from './columns'
import ServerPagination from './ServerPagination'
import TransactionFormModal from './TransactionFormModal'
import Notification from '../../../components/Notification'

function Payments() {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [notification, setNotification] = useState<{
        message: string
        type: 'success' | 'error' | 'info' | 'warning'
        isVisible: boolean
    }>({
        message: '',
        type: 'success',
        isVisible: false,
    })

    const { data: transactionsResponse, isLoading, error } = useTransactions({ page, limit })
    const { data: borrowersResponse } = useBorrowers({ page: 1, limit: 1000 })

    const borrowers = borrowersResponse?.data || []
    const transactions = transactionsResponse?.data || []
    const meta = transactionsResponse?.meta

    const borrowerNameMap = useMemo(() => {
        const map = new Map<string, string>()

        borrowers.forEach((borrower) => {
            map.set(borrower.id, borrower.full_name)
        })

        return map
    }, [borrowers])

    const transactionRows = useMemo<TransactionTableRow[]>(() => {
        return transactions.map((transaction) => ({
            ...transaction,
            borrower_name: borrowerNameMap.get(transaction.borrower_id) || 'Unknown Borrower',
        }))
    }, [transactions, borrowerNameMap])

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage)
    }, [])

    const handleLimitChange = useCallback((newLimit: number) => {
        setLimit(newLimit)
        setPage(1)
    }, [])

    const handleAddTransaction = useCallback(() => {
        setIsCreateModalOpen(true)
    }, [])

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
    })

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <p className="text-gray-500">Loading transactions...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <p className="text-red-500">Error loading transactions: {error.message}</p>
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
                    title="Transactions"
                    description="Track and manage loan transactions"
                    addButtonText="+ Add Transaction"
                    onAddClick={handleAddTransaction}
                />

                <div>
                    <DataTable table={table} />
                    {transactionRows.length === 0 && (
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
                        message: 'Transaction created successfully!',
                        type: 'success',
                        isVisible: true,
                    })
                }}
            />

            <Notification
                message={notification.message}
                type={notification.type}
                isVisible={notification.isVisible}
                onClose={() => setNotification({ ...notification, isVisible: false })}
            />
        </>
    )
}

export default Payments
