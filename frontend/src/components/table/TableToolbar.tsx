import type { Table as TanStackTable } from "@tanstack/react-table";

interface TableToolbarProps<TData> {
  table: TanStackTable<TData>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  title: string;
  description?: string;
  addButtonText?: string;
  onAddClick?: () => void;
}

export function TableToolbar<TData>({
  table,
  globalFilter,
  setGlobalFilter,
  title,
  description,
  addButtonText,
  onAddClick,
}: TableToolbarProps<TData>) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {description && <p className="text-gray-600 mt-1">{description}</p>}
        </div>
        {addButtonText && onAddClick && (
          <button
            onClick={onAddClick}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span>{addButtonText}</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search all columns..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="text-sm text-gray-600 whitespace-nowrap">
          {table.getFilteredRowModel().rows.length} results
        </div>
      </div>
    </div>
  );
}
