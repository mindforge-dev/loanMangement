import { createColumnHelper } from '@tanstack/react-table'
import type { Transaction } from '../../../services/transactionService'

export interface TransactionTableRow extends Transaction {
    borrower_name: string
}

const columnHelper = createColumnHelper<TransactionTableRow>()

const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('my-MM', {
        style: 'currency',
        currency: 'MMK',
        minimumFractionDigits: 2,
    }).format(parseFloat(amount || '0'))
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export const transactionColumns = [
    columnHelper.accessor('borrower_name', {
        header: 'Borrower',
        cell: (info) => <div className="text-sm font-medium text-gray-900">{info.getValue()}</div>,
    }),
    columnHelper.accessor('type', {
        header: 'Type',
        cell: (info) => <div className="text-sm text-gray-700">{info.getValue()}</div>,
    }),
    columnHelper.accessor('amount_paid', {
        header: 'Amount Paid',
        cell: (info) => <div className="text-sm font-semibold text-gray-900">{formatCurrency(info.getValue())}</div>,
    }),
    columnHelper.accessor('remaining_balance', {
        header: 'Remaining Balance',
        cell: (info) => <div className="text-sm text-gray-700">{formatCurrency(info.getValue())}</div>,
    }),
    columnHelper.accessor('payment_term_months', {
        header: 'Term',
        cell: (info) => <div className="text-sm text-gray-700">Month {info.getValue()}</div>,
    }),
    columnHelper.accessor('method', {
        header: 'Method',
        cell: (info) => <div className="text-sm text-gray-700">{info.getValue()}</div>,
    }),
    columnHelper.accessor('payment_date', {
        header: 'Payment Date',
        cell: (info) => <div className="text-sm text-gray-700">{formatDate(info.getValue())}</div>,
    }),
    columnHelper.accessor('note', {
        header: 'Note',
        cell: (info) => (
            <div className="text-sm text-gray-600 max-w-xs truncate" title={info.getValue() || undefined}>
                {info.getValue() || '-'}
            </div>
        ),
    }),
]
