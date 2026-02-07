# TanStack Query + Axios Setup

Complete setup for data fetching with **TanStack Query** (React Query) and **Axios**.

## 📦 Packages Installed

- `@tanstack/react-query` - Powerful data synchronization for React
- `axios` - Promise-based HTTP client

## 🏗️ Project Structure

```
src/
├── lib/
│   ├── axios.ts           # Axios instance with interceptors
│   └── queryClient.ts     # React Query client configuration
├── services/
│   └── userService.ts     # API service functions
└── hooks/
    └── useUsers.ts        # React Query hooks
```

## ⚙️ Configuration

### Axios Instance (`src/lib/axios.ts`)

Pre-configured Axios instance with:
- ✅ Base URL from environment variables
- ✅ Request interceptor for auth tokens
- ✅ Response interceptor for error handling
- ✅ Automatic 401 redirect to login

**Usage:**
```tsx
import { api } from '@/lib/axios'

const response = await api.get('/users')
```

### Query Client (`src/lib/queryClient.ts`)

Configured with sensible defaults:
- ✅ Retry failed requests once
- ✅ Don't refetch on window focus
- ✅ 5-minute stale time

## 🔌 API Services

### User Service (`src/services/userService.ts`)

CRUD operations for users:

```tsx
import { getUsers, createUser, updateUser, deleteUser } from '@/services/userService'

// Get all users
const users = await getUsers()

// Create user
const newUser = await createUser({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'User',
  status: 'Active'
})

// Update user
const updated = await updateUser(1, { name: 'Jane Doe' })

// Delete user
await deleteUser(1)
```

## 🪝 React Query Hooks

### useUsers Hook (`src/hooks/useUsers.ts`)

Pre-built hooks for all user operations:

#### 1. **Fetch All Users**
```tsx
import { useUsers } from '@/hooks/useUsers'

function UsersList() {
  const { data, isLoading, error } = useUsers()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {data?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

#### 2. **Fetch Single User**
```tsx
import { useUser } from '@/hooks/useUsers'

function UserDetail({ id }: { id: number }) {
  const { data: user, isLoading } = useUser(id)

  if (isLoading) return <div>Loading...</div>

  return <div>{user?.name}</div>
}
```

#### 3. **Create User**
```tsx
import { useCreateUser } from '@/hooks/useUsers'

function CreateUserForm() {
  const createUser = useCreateUser()

  const handleSubmit = (data) => {
    createUser.mutate(data, {
      onSuccess: () => {
        alert('User created!')
      },
      onError: (error) => {
        alert('Error: ' + error.message)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={createUser.isPending}>
        {createUser.isPending ? 'Creating...' : 'Create User'}
      </button>
    </form>
  )
}
```

#### 4. **Update User**
```tsx
import { useUpdateUser } from '@/hooks/useUsers'

function EditUser({ id }: { id: number }) {
  const updateUser = useUpdateUser()

  const handleUpdate = (data) => {
    updateUser.mutate({ id, data })
  }

  return <button onClick={() => handleUpdate({ name: 'New Name' })}>Update</button>
}
```

#### 5. **Delete User**
```tsx
import { useDeleteUser } from '@/hooks/useUsers'

function DeleteButton({ id }: { id: number }) {
  const deleteUser = useDeleteUser()

  const handleDelete = () => {
    if (confirm('Are you sure?')) {
      deleteUser.mutate(id)
    }
  }

  return (
    <button onClick={handleDelete} disabled={deleteUser.isPending}>
      {deleteUser.isPending ? 'Deleting...' : 'Delete'}
    </button>
  )
}
```

## 🌍 Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:3000/api
```

**Note:** Vite requires `VITE_` prefix for environment variables.

## 🎯 Benefits

### TanStack Query
- ✅ **Automatic caching** - No duplicate requests
- ✅ **Background refetching** - Always fresh data
- ✅ **Optimistic updates** - Instant UI feedback
- ✅ **Error handling** - Built-in retry logic
- ✅ **Loading states** - Easy to show spinners
- ✅ **Cache invalidation** - Automatic data sync

### Axios
- ✅ **Interceptors** - Global auth and error handling
- ✅ **Request/Response transformation** - Automatic JSON parsing
- ✅ **Timeout handling** - Prevent hanging requests
- ✅ **Cancel requests** - Abort ongoing requests
- ✅ **Progress tracking** - Upload/download progress

## 📝 Creating New Services

To add a new resource (e.g., Loans):

### 1. Create Service (`src/services/loanService.ts`)
```tsx
import { api } from '../lib/axios'

export interface Loan {
  id: number
  amount: number
  borrower: string
  status: string
}

export const getLoans = async (): Promise<Loan[]> => {
  const response = await api.get<Loan[]>('/loans')
  return response.data
}

export const createLoan = async (data: Partial<Loan>): Promise<Loan> => {
  const response = await api.post<Loan>('/loans', data)
  return response.data
}
```

### 2. Create Hooks (`src/hooks/useLoans.ts`)
```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getLoans, createLoan } from '../services/loanService'

export const loanKeys = {
  all: ['loans'] as const,
  lists: () => [...loanKeys.all, 'list'] as const,
}

export const useLoans = () => {
  return useQuery({
    queryKey: loanKeys.lists(),
    queryFn: getLoans,
  })
}

export const useCreateLoan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanKeys.lists() })
    },
  })
}
```

### 3. Use in Component
```tsx
import { useLoans, useCreateLoan } from '@/hooks/useLoans'

function LoansPage() {
  const { data: loans, isLoading } = useLoans()
  const createLoan = useCreateLoan()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {loans?.map(loan => (
        <div key={loan.id}>{loan.borrower}</div>
      ))}
    </div>
  )
}
```

## 🔧 Advanced Features

### Optimistic Updates
```tsx
const updateUser = useMutation({
  mutationFn: ({ id, data }) => updateUser(id, data),
  onMutate: async ({ id, data }) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: userKeys.detail(id) })

    // Snapshot previous value
    const previous = queryClient.getQueryData(userKeys.detail(id))

    // Optimistically update
    queryClient.setQueryData(userKeys.detail(id), (old) => ({
      ...old,
      ...data
    }))

    return { previous }
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(
      userKeys.detail(variables.id),
      context?.previous
    )
  },
})
```

### Infinite Queries (Pagination)
```tsx
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['users'],
  queryFn: ({ pageParam = 1 }) => getUsers(pageParam),
  getNextPageParam: (lastPage, pages) => lastPage.nextPage,
})
```

### Dependent Queries
```tsx
const { data: user } = useUser(userId)
const { data: posts } = usePosts(user?.id, {
  enabled: !!user?.id, // Only fetch when user is loaded
})
```

## 📚 Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Axios Docs](https://axios-http.com/)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)

## 🚀 Next Steps

1. **Connect to real backend** - Update `VITE_API_URL` in `.env`
2. **Add more services** - Create services for Loans, Payments, etc.
3. **Error boundaries** - Add global error handling
4. **Loading states** - Create reusable loading components
5. **DevTools** - Install React Query DevTools for debugging
