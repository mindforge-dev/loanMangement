
export interface PaginationMeta {
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface ServerPaginationProps {
    meta?: PaginationMeta;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}
