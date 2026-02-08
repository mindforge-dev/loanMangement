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
import { useBorrowers, useDeleteBorrower } from '../../../hooks/useBorrowers'
import type { Borrower } from '../../../services/borrowerService'
import { createBorrowerColumns } from './columns'
import ServerPagination from './ServerPagination'

function Borrowers() {
    // Pagination state
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)

    const { data: borrowersResponse, isLoading, error } = useBorrowers({ page, limit })
    const deleteBorrowerMutation = useDeleteBorrower()

    // Extract borrowers and meta from paginated response
    const borrowers = borrowersResponse?.data || []
    const meta = borrowersResponse?.meta

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')

    const handleEdit = useCallback((borrower: Borrower) => {
        console.log('Edit borrower:', borrower)
        // TODO: Implement edit functionality
    }, [])

    const handleDelete = useCallback(async (id: string) => {
        if (confirm('Are you sure you want to delete this borrower?')) {
            try {
                await deleteBorrowerMutation.mutateAsync(id)
            } catch (error) {
                console.error('Failed to delete borrower:', error)
            }
        }
    }, [deleteBorrowerMutation])

    const handleAddBorrower = useCallback(() => {
        console.log('Add new borrower')
        // TODO: Implement add borrower functionality
    }, [])

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage)
    }, [])

    const handleLimitChange = useCallback((newLimit: number) => {
        setLimit(newLimit)
        setPage(1) // Reset to first page when changing limit
    }, [])

    const columns = useMemo(
        () => createBorrowerColumns(handleEdit, handleDelete, deleteBorrowerMutation.isPending),
        [handleEdit, handleDelete, deleteBorrowerMutation.isPending]
    )

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
    })

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <p className="text-gray-500">Loading borrowers...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <p className="text-red-500">Error loading borrowers: {error.message}</p>
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
                title="Borrowers"
                description="Manage borrower information"
                addButtonText="+ Add Borrower"
                onAddClick={handleAddBorrower}
            />

            <div>
                <DataTable table={table} />
                <ServerPagination
                    meta={meta}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                />
            </div>
        </div>
    )
}

export default Borrowers
