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

type User = {
    id: number
    name: string
    email: string
    role: string
    status: 'Active' | 'Inactive'
}

const columnHelper = createColumnHelper<User>()

function Users() {
    const [data, setData] = useState<User[]>([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
        { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Manager', status: 'Active' },
        { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'Active' },
        { id: 6, name: 'Diana Prince', email: 'diana@example.com', role: 'Admin', status: 'Active' },
        { id: 7, name: 'Ethan Hunt', email: 'ethan@example.com', role: 'User', status: 'Inactive' },
        { id: 8, name: 'Fiona Gallagher', email: 'fiona@example.com', role: 'Manager', status: 'Active' },
    ])

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')

    const columns = useMemo(
        () => [
            columnHelper.accessor('name', {
                header: 'Name',
                cell: (info) => (
                    <div className="text-sm font-medium text-gray-900">{info.getValue()}</div>
                ),
            }),
            columnHelper.accessor('email', {
                header: 'Email',
                cell: (info) => (
                    <div className="text-sm text-gray-600">{info.getValue()}</div>
                ),
            }),
            columnHelper.accessor('role', {
                header: 'Role',
                cell: (info) => (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {info.getValue()}
                    </span>
                ),
            }),
            columnHelper.accessor('status', {
                header: 'Status',
                cell: (info) => (
                    <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${info.getValue() === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}
                    >
                        {info.getValue()}
                    </span>
                ),
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
        data,
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

    const handleEdit = (user: User) => {
        console.log('Edit user:', user)
        // TODO: Implement edit functionality
    }

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setData((prev) => prev.filter((user) => user.id !== id))
        }
    }

    const handleAddUser = () => {
        console.log('Add new user')
        // TODO: Implement add user functionality
    }

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
                <DataTable table={table} />
                <Pagination table={table} />
            </div>
        </div>
    )
}

export default Users
