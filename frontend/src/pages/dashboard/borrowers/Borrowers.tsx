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
import BorrowerFormModal from './BorrowerFormModal'
import Notification from '../../../components/Notification'

function Borrowers() {
    // Pagination state
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null)
    const [notification, setNotification] = useState<{
        message: string
        type: 'success' | 'error' | 'info' | 'warning'
        isVisible: boolean
    }>({
        message: '',
        type: 'success',
        isVisible: false,
    })

    const { data: borrowersResponse, isLoading, error } = useBorrowers({ page, limit })
    const deleteBorrowerMutation = useDeleteBorrower()

    // Extract borrowers and meta from paginated response
    const borrowers = borrowersResponse?.data || []
    const meta = borrowersResponse?.meta

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')

    const handleEdit = useCallback((borrower: Borrower) => {
        setSelectedBorrower(borrower)
        setIsEditModalOpen(true)
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
        setIsCreateModalOpen(true)
    }, [])

    const handleCloseEditModal = useCallback(() => {
        setIsEditModalOpen(false)
        setSelectedBorrower(null)
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
                    <DataTable table={table} />
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
                            message: mode === 'create' ? 'Borrower created successfully!' : 'Borrower updated successfully!',
                            type: 'success',
                            isVisible: true,
                        })
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
                            message: mode === 'create' ? 'Borrower created successfully!' : 'Borrower updated successfully!',
                            type: 'success',
                            isVisible: true,
                        })
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
    )
}

export default Borrowers
