# TanStack Table Implementation

This project uses **TanStack Table v8** (formerly React Table) for powerful, flexible data tables.

## Features Implemented

### Users Table (`src/pages/dashboard/Users.tsx`)

✅ **Sorting**
- Click column headers to sort
- Visual indicators (↑ ↓) for sort direction
- Multi-column sorting support

✅ **Global Search**
- Search across all columns
- Real-time filtering
- Shows filtered count

✅ **Pagination**
- First, Previous, Next, Last page buttons
- Page size selector (5, 10, 20, 30 rows)
- Current page indicator

✅ **Actions**
- Edit button per row
- Delete button with confirmation
- Easy to extend with more actions

## Usage Example

```tsx
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  // Add more features as needed
})
```

## Column Definition

```tsx
const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  // ... more columns
]
```

## Available Features

TanStack Table supports many more features you can add:

- ✅ Sorting (implemented)
- ✅ Filtering (implemented)
- ✅ Pagination (implemented)
- ⚪ Column Resizing
- ⚪ Column Visibility
- ⚪ Row Selection
- ⚪ Expandable Rows
- ⚪ Grouping
- ⚪ Virtualization (for large datasets)

## Adding More Tables

To create a new table in other pages:

1. **Import dependencies:**
```tsx
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
```

2. **Define your data type:**
```tsx
type MyData = {
  id: number
  field1: string
  field2: number
}
```

3. **Create column helper:**
```tsx
const columnHelper = createColumnHelper<MyData>()
```

4. **Define columns:**
```tsx
const columns = [
  columnHelper.accessor('field1', {
    header: 'Field 1',
  }),
  // ... more columns
]
```

5. **Initialize table:**
```tsx
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
})
```

6. **Render table:**
```tsx
<table>
  <thead>
    {table.getHeaderGroups().map(headerGroup => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map(header => (
          <th key={header.id}>
            {flexRender(header.column.columnDef.header, header.getContext())}
          </th>
        ))}
      </tr>
    ))}
  </thead>
  <tbody>
    {table.getRowModel().rows.map(row => (
      <tr key={row.id}>
        {row.getVisibleCells().map(cell => (
          <td key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>
```

## Resources

- [TanStack Table Docs](https://tanstack.com/table/latest)
- [Examples](https://tanstack.com/table/latest/docs/examples/react/basic)
- [API Reference](https://tanstack.com/table/latest/docs/api/core/table)

## Next Steps

Consider implementing:
1. **Row Selection** - Bulk actions on multiple users
2. **Column Filters** - Individual column filtering
3. **Export** - Export table data to CSV/Excel
4. **Inline Editing** - Edit cells directly in the table
5. **Server-Side** - Pagination, sorting, filtering on the backend
