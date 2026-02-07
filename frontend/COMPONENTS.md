# Reusable Table Components

Generic, data-agnostic table components built with TanStack Table and Tailwind CSS.

## Components

### 1. DataTable
**Location:** `src/components/table/DataTable.tsx`

Generic table component that renders any data with TanStack Table.

**Features:**
- ✅ Sortable columns (click headers)
- ✅ Visual sort indicators (↑ ↓)
- ✅ Hover effects on rows
- ✅ Responsive design
- ✅ Works with any data type

**Usage:**
```tsx
import { DataTable } from '@/components/table'

<DataTable table={table} />
```

**Props:**
- `table`: TanStack Table instance

---

### 2. Pagination
**Location:** `src/components/table/Pagination.tsx`

Generic pagination component for navigating table pages.

**Features:**
- ✅ First/Previous/Next/Last buttons
- ✅ Page size selector (5, 10, 20, 30, 50)
- ✅ Current page indicator
- ✅ Disabled state for unavailable actions
- ✅ Works with any data type

**Usage:**
```tsx
import { Pagination } from '@/components/table'

<Pagination table={table} />
```

**Props:**
- `table`: TanStack Table instance

---

### 3. TableToolbar
**Location:** `src/components/table/TableToolbar.tsx`

Generic toolbar with search, title, and optional action button.

**Features:**
- ✅ Global search across all columns
- ✅ Results counter
- ✅ Customizable title and description
- ✅ Optional "Add" button
- ✅ Works with any data type

**Usage:**
```tsx
import { TableToolbar } from '@/components/table'

<TableToolbar
  table={table}
  globalFilter={globalFilter}
  setGlobalFilter={setGlobalFilter}
  title="Users"
  description="Manage your system users"
  addButtonText="+ Add User"
  onAddClick={handleAddUser}
/>
```

**Props:**
- `table`: TanStack Table instance
- `globalFilter`: Current global filter value
- `setGlobalFilter`: Function to update global filter
- `title`: Page/table title
- `description?`: Optional description text
- `addButtonText?`: Optional button text
- `onAddClick?`: Optional button click handler

---

## Complete Example

Here's how to use all components together:

```tsx
import { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
} from '@tanstack/react-table'
import { DataTable, Pagination, TableToolbar } from '@/components/table'

type MyData = {
  id: number
  name: string
  email: string
}

const columnHelper = createColumnHelper<MyData>()

function MyPage() {
  const [data, setData] = useState<MyData[]>([...])
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
      }),
      columnHelper.accessor('email', {
        header: 'Email',
      }),
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="space-y-6">
      <TableToolbar
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        title="My Data"
        description="Manage your data"
        addButtonText="+ Add Item"
        onAddClick={() => console.log('Add clicked')}
      />

      <div>
        <DataTable table={table} />
        <Pagination table={table} />
      </div>
    </div>
  )
}
```

---

## Benefits

### 🎯 Reusability
- Use the same components for Users, Loans, Payments, etc.
- No code duplication
- Consistent UI across all tables

### 🔧 Maintainability
- Update table styling in one place
- Easy to add new features
- Clear separation of concerns

### 📦 Type Safety
- Full TypeScript support
- Generic types work with any data
- Compile-time error checking

### 🎨 Customization
- Easy to extend with new props
- Tailwind CSS for styling
- Consistent design system

---

## Adding to Other Pages

To add a table to another page (e.g., Loans):

1. **Define your data type:**
```tsx
type Loan = {
  id: number
  amount: number
  borrower: string
  status: string
}
```

2. **Create columns:**
```tsx
const columns = useMemo(
  () => [
    columnHelper.accessor('borrower', { header: 'Borrower' }),
    columnHelper.accessor('amount', { header: 'Amount' }),
    columnHelper.accessor('status', { header: 'Status' }),
  ],
  []
)
```

3. **Initialize table:**
```tsx
const table = useReactTable({
  data,
  columns,
  state: { sorting, columnFilters, globalFilter },
  // ... other config
})
```

4. **Use components:**
```tsx
<TableToolbar
  table={table}
  globalFilter={globalFilter}
  setGlobalFilter={setGlobalFilter}
  title="Loans"
  description="Manage loan applications"
/>
<DataTable table={table} />
<Pagination table={table} />
```

---

## File Structure

```
src/
├── components/
│   └── table/
│       ├── index.ts           # Barrel exports
│       ├── DataTable.tsx      # Generic table
│       ├── Pagination.tsx     # Generic pagination
│       └── TableToolbar.tsx   # Generic toolbar
└── pages/
    └── dashboard/
        └── Users.tsx          # Example usage
```

---

## Future Enhancements

Consider adding:
- **Column visibility toggle**
- **Export to CSV/Excel**
- **Row selection with checkboxes**
- **Bulk actions**
- **Column resizing**
- **Advanced filters per column**
- **Loading states**
- **Empty states**
- **Error states**
