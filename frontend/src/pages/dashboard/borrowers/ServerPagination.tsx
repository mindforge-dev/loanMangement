import type { PaginationMeta } from '../../../services/borrowerService'

interface ServerPaginationProps {
    meta?: PaginationMeta
    onPageChange: (page: number) => void
    onLimitChange: (limit: number) => void
}

export default function ServerPagination({ meta, onPageChange, onLimitChange }: ServerPaginationProps) {
    if (!meta) return null

    const { page, limit, total, totalPages } = meta
    const startItem = (page - 1) * limit + 1
    const endItem = Math.min(page * limit, total)

    const handlePrevious = () => {
        if (page > 1) {
            onPageChange(page - 1)
        }
    }

    const handleNext = () => {
        if (page < totalPages) {
            onPageChange(page + 1)
        }
    }

    const handlePageClick = (pageNum: number) => {
        onPageChange(pageNum)
    }

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        const maxVisible = 7

        if (totalPages <= maxVisible) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Show first page
            pages.push(1)

            if (page > 3) {
                pages.push('...')
            }

            // Show pages around current page
            const start = Math.max(2, page - 1)
            const end = Math.min(totalPages - 1, page + 1)

            for (let i = start; i <= end; i++) {
                pages.push(i)
            }

            if (page < totalPages - 2) {
                pages.push('...')
            }

            // Show last page
            pages.push(totalPages)
        }

        return pages
    }

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between w-full">
                {/* Results info */}
                <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{startItem}</span> to{' '}
                        <span className="font-medium">{endItem}</span> of{' '}
                        <span className="font-medium">{total}</span> results
                    </p>

                    {/* Items per page */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="limit" className="text-sm text-gray-700">
                            Per page:
                        </label>
                        <select
                            id="limit"
                            value={limit}
                            onChange={(e) => onLimitChange(Number(e.target.value))}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>

                {/* Pagination controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrevious}
                        disabled={page === 1}
                        className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    <div className="flex gap-1">
                        {getPageNumbers().map((pageNum, index) => {
                            if (pageNum === '...') {
                                return (
                                    <span
                                        key={`ellipsis-${index}`}
                                        className="px-3 py-1 text-sm text-gray-700"
                                    >
                                        ...
                                    </span>
                                )
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageClick(pageNum as number)}
                                    className={`px-3 py-1 text-sm font-medium rounded-md ${page === pageNum
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            )
                        })}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={page === totalPages}
                        className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}
