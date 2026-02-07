import { createColumnHelper } from '@tanstack/react-table'
import type { Borrower } from '../../../services/borrowerService'

const columnHelper = createColumnHelper<Borrower>()

// Helper function
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

// Column definitions
export const createBorrowerColumns = (
    handleEdit: (borrower: Borrower) => void,
    handleDelete: (id: string) => void,
    isDeleting: boolean
) => [
        columnHelper.accessor('full_name', {
            header: 'Full Name',
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
        columnHelper.accessor('phone', {
            header: 'Phone',
            cell: (info) => (
                <div className="text-sm text-gray-600">{info.getValue()}</div>
            ),
        }),
        columnHelper.accessor('nrc', {
            header: 'NRC',
            cell: (info) => (
                <div className="text-sm text-gray-600">{info.getValue()}</div>
            ),
        }),
        columnHelper.accessor('address', {
            header: 'Address',
            cell: (info) => (
                <div className="text-sm text-gray-600 max-w-xs truncate" title={info.getValue()}>
                    {info.getValue()}
                </div>
            ),
        }),
        columnHelper.accessor('created_at', {
            header: 'Created At',
            cell: (info) => (
                <div className="text-sm text-gray-600">
                    {formatDate(info.getValue())}
                </div>
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
                        disabled={isDeleting}
                    >
                        Delete
                    </button>
                </div>
            ),
        }),
    ]
