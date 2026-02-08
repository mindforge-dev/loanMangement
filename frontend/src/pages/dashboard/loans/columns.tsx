import { createColumnHelper } from '@tanstack/react-table'
import type { Loan } from '../../../services/loanService'

const columnHelper = createColumnHelper<Loan>()

// Helper functions
const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('my-MM', {
        style: 'currency',
        currency: 'MMK',
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

// Column definitions
export const createLoanColumns = (
    handleEdit: (loan: Loan) => void,
    handleDelete: (id: string) => void,
    isDeleting: boolean
) => [
        columnHelper.accessor('borrower', {
            id: 'borrower_name',
            header: 'Borrower',
            cell: (info) => {
                const borrower = info.getValue()
                return (
                    <div className="text-sm font-medium text-gray-900">
                        {borrower?.full_name || 'N/A'}
                    </div>
                )
            },
            enableColumnFilter: true,
        }),
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
                const statusColors: Record<string, string> = {
                    PENDING: 'bg-yellow-100 text-yellow-800',
                    ACTIVE: 'bg-green-100 text-green-800',
                    COMPLETED: 'bg-blue-100 text-blue-800',
                    DEFAULTED: 'bg-red-100 text-red-800',
                    REJECTED: 'bg-gray-100 text-gray-800',
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
                        disabled={isDeleting}
                    >
                        Delete
                    </button>
                </div>
            ),
        }),
    ]
