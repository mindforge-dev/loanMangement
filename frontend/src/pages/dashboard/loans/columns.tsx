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
    handleStatusChange: (id: string, status: Loan['status']) => void,
    isDeleting: boolean,
    canEdit: boolean,
    canDelete: boolean,
    canUpdateStatus: boolean,
    canViewContracts: boolean,
    handleViewContracts: (loan: Loan) => void
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
                const loan = info.row.original
                const statusColors: Record<string, string> = {
                    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                    ACTIVE: 'bg-green-100 text-green-800 border-green-300',
                    COMPLETED: 'bg-blue-100 text-blue-800 border-blue-300',
                    DEFAULTED: 'bg-red-100 text-red-800 border-red-300',
                    REJECTED: 'bg-gray-100 text-gray-800 border-gray-300',
                }
                if (!canUpdateStatus) {
                    return (
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border-2 ${statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                            {status}
                        </span>
                    )
                }
                return (
                    <select
                        value={status}
                        onChange={(e) => handleStatusChange(loan.id, e.target.value as Loan['status'])}
                        className={`px-3 py-1 text-xs font-semibold rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}
                    >
                        <option value="PENDING">PENDING</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="DEFAULTED">DEFAULTED</option>
                        <option value="REJECTED">REJECTED</option>
                    </select>
                )
            },
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: (info) => {
                const showActions = canEdit || canDelete || canViewContracts
                if (!showActions) return null
                return (
                    <div className="text-sm font-medium space-x-2">
                        {canViewContracts && (
                            <button
                                onClick={() => handleViewContracts(info.row.original)}
                                className="text-teal-600 hover:text-teal-900"
                            >
                                Contracts
                            </button>
                        )}
                        {canEdit && (
                            <button
                                onClick={() => handleEdit(info.row.original)}
                                className="text-indigo-600 hover:text-indigo-900"
                            >
                                Edit
                            </button>
                        )}
                        {canDelete && (
                            <button
                                onClick={() => handleDelete(info.row.original.id)}
                                className="text-red-600 hover:text-red-900"
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        )}
                    </div>
                )
            },
        }),
    ]
