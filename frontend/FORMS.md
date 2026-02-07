# React Hook Form + Zod Validation

Complete form validation setup using **React Hook Form** and **Zod** for type-safe, performant forms.

## 📦 Packages Installed

- `react-hook-form` - Performant form library with minimal re-renders
- `zod` - TypeScript-first schema validation
- `@hookform/resolvers` - Resolvers for validation libraries

## 🏗️ Project Structure

```
src/
├── schemas/
│   └── authSchemas.ts     # Zod validation schemas
└── pages/auth/
    ├── Login.tsx          # Login form with validation
    └── Register.tsx       # Register form with validation
```

## 🎯 Features

### Login Form
- ✅ Email validation (required, valid email format)
- ✅ Password validation (required, min 6 characters)
- ✅ Real-time error messages
- ✅ Field-level validation
- ✅ Submit button disabled during validation
- ✅ Type-safe form data

### Register Form
- ✅ Name validation (required, min 2 characters)
- ✅ Email validation (required, valid email format)
- ✅ Password validation (required, min 6 characters)
- ✅ Password confirmation (must match password)
- ✅ Terms acceptance (required checkbox)
- ✅ Real-time error messages
- ✅ Cross-field validation

## 📝 Validation Schemas

### Login Schema (`src/schemas/authSchemas.ts`)

```typescript
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>
```

### Register Schema

```typescript
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
    terms: z
      .boolean()
      .refine((val) => val === true, {
        message: 'You must accept the terms and conditions',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>
```

## 🔧 Usage

### Basic Form Setup

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData } from '@/schemas/authSchemas'

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginFormData) => {
    console.log(data) // Type-safe data
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* form fields */}
    </form>
  )
}
```

### Input Field with Validation

```tsx
<div>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    {...register('email')}
    className={errors.email ? 'border-red-500' : 'border-gray-300'}
  />
  {errors.email && (
    <p className="text-red-600">{errors.email.message}</p>
  )}
</div>
```

### Submit Button

```tsx
<button
  type="submit"
  disabled={isSubmitting}
>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</button>
```

## ✨ Benefits

### React Hook Form
- ⚡ **Performance** - Minimal re-renders
- 📦 **Small bundle** - ~9kb gzipped
- 🎯 **Focused API** - Easy to learn
- 🔧 **Flexible** - Works with any UI library
- 📝 **TypeScript** - Full type safety
- 🎨 **No dependencies** - Pure React

### Zod
- 🛡️ **Type-safe** - Inferred TypeScript types
- 🔍 **Runtime validation** - Catch errors early
- 📖 **Readable** - Clear schema definitions
- 🔄 **Composable** - Reuse schemas
- 🎯 **Precise errors** - Detailed error messages
- 🚀 **Fast** - Optimized for performance

## 🎨 Validation Features

### Field-Level Validation

```typescript
email: z
  .string()
  .min(1, 'Email is required')           // Required check
  .email('Invalid email address')        // Format check
```

### Cross-Field Validation

```typescript
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],  // Error shows on confirmPassword field
})
```

### Custom Validation

```typescript
terms: z
  .boolean()
  .refine((val) => val === true, {
    message: 'You must accept the terms',
  })
```

### Conditional Validation

```typescript
age: z
  .number()
  .optional()
  .refine((val) => !val || val >= 18, {
    message: 'Must be 18 or older',
  })
```

## 📋 Validation Rules

### Login Form

| Field    | Rules                                    |
|----------|------------------------------------------|
| Email    | Required, Valid email format             |
| Password | Required, Minimum 6 characters           |

### Register Form

| Field            | Rules                                    |
|------------------|------------------------------------------|
| Name             | Required, Minimum 2 characters           |
| Email            | Required, Valid email format             |
| Password         | Required, Minimum 6 characters           |
| Confirm Password | Required, Must match password            |
| Terms            | Required, Must be checked                |

## 🔍 Error Handling

### Display Errors

```tsx
{errors.email && (
  <p className="mt-1 text-sm text-red-600">
    {errors.email.message}
  </p>
)}
```

### Error Styling

```tsx
className={`
  w-full px-4 py-3 border rounded-lg
  ${errors.email ? 'border-red-500' : 'border-gray-300'}
`}
```

### Form-Level Errors

```tsx
{errors.root && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
    <p className="text-sm">{errors.root.message}</p>
  </div>
)}
```

## 🚀 Advanced Features

### Default Values

```tsx
useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  defaultValues: {
    email: 'admin@mindforge.com',
    password: 'admin123',
  },
})
```

### Reset Form

```tsx
const { reset } = useForm()

// Reset to default values
reset()

// Reset to specific values
reset({ email: '', password: '' })
```

### Watch Fields

```tsx
const { watch } = useForm()

const password = watch('password')
console.log('Current password:', password)
```

### Set Field Value

```tsx
const { setValue } = useForm()

setValue('email', 'new@email.com')
```

### Manual Validation

```tsx
const { trigger } = useForm()

// Validate single field
await trigger('email')

// Validate all fields
await trigger()
```

## 📚 Creating New Schemas

### Example: User Profile Schema

```typescript
export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  age: z.number().min(18, 'Must be 18 or older').max(120, 'Invalid age'),
  website: z.string().url('Invalid URL').optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
})

export type ProfileFormData = z.infer<typeof profileSchema>
```

### Example: Loan Application Schema

```typescript
export const loanSchema = z.object({
  amount: z
    .number()
    .min(1000, 'Minimum loan amount is $1,000')
    .max(1000000, 'Maximum loan amount is $1,000,000'),
  purpose: z.enum(['personal', 'business', 'education', 'home']),
  term: z.number().min(6).max(360), // months
  income: z.number().positive('Income must be positive'),
  employment: z.enum(['employed', 'self-employed', 'unemployed']),
})

export type LoanFormData = z.infer<typeof loanSchema>
```

## 🎯 Best Practices

1. **Keep schemas separate** - Store in `src/schemas/`
2. **Use TypeScript inference** - `z.infer<typeof schema>`
3. **Provide clear error messages** - User-friendly text
4. **Validate on blur** - Better UX than on change
5. **Disable submit during validation** - Prevent duplicate submissions
6. **Show field-level errors** - Near the input field
7. **Use default values** - For better UX
8. **Reset form after success** - Clear fields

## 🔧 Integration with React Query

```tsx
const login = useLogin()

const onSubmit = (data: LoginFormData) => {
  login.mutate(data, {
    onSuccess: () => {
      reset() // Clear form
    },
    onError: (error) => {
      setError('root', {
        message: error.message,
      })
    },
  })
}
```

## 📖 Resources

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Docs](https://zod.dev/)
- [Resolver Docs](https://github.com/react-hook-form/resolvers)

## ✅ Testing

### Manual Testing

1. **Required Fields**:
   - Leave email empty → See "Email is required"
   - Leave password empty → See "Password is required"

2. **Email Validation**:
   - Enter "invalid" → See "Invalid email address"
   - Enter "test@example.com" → No error

3. **Password Length**:
   - Enter "12345" → See "Password must be at least 6 characters"
   - Enter "123456" → No error

4. **Password Confirmation** (Register):
   - Enter different passwords → See "Passwords don't match"
   - Enter matching passwords → No error

5. **Terms Checkbox** (Register):
   - Don't check → See "You must accept the terms and conditions"
   - Check → No error

## 🎉 Summary

You now have:
- ✅ Type-safe form validation
- ✅ Real-time error messages
- ✅ Better UX with field-level errors
- ✅ Performant forms with minimal re-renders
- ✅ Reusable validation schemas
- ✅ Easy to extend and maintain

Try the forms at:
- **Login**: http://localhost:5173/login
- **Register**: http://localhost:5173/register
