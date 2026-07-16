import type { CreateLoanDto } from '../../../../services/loanService'

export const LOAN_TYPES = ['PERSONAL', 'HOME', 'AUTO', 'BUSINESS', 'EDUCATION', 'OTHER'] as const

export type LoanType = typeof LOAN_TYPES[number]

export interface LoanFormData {
    borrower_id: string
    interest_rate_id: string
    principal_amount: string
    loan_type: LoanType
    start_date: string
    term_months: number
}

export interface LoanFormErrors {
    borrower_id?: string
    interest_rate_id?: string
    principal_amount?: string
    loan_type?: string
    start_date?: string
    end_date?: string
    term_months?: string
}

export interface LoanFormProps {
    isOpen: boolean
    onClose: () => void
    initialData?: Partial<LoanFormData>
    loanId?: string
    mode?: 'create' | 'edit'
    onSuccess?: (mode: 'create' | 'edit') => void
}

export const getInitialFormData = (initialData?: Partial<LoanFormData>): LoanFormData => ({
    borrower_id: initialData?.borrower_id || '',
    interest_rate_id: initialData?.interest_rate_id || '',
    principal_amount: initialData?.principal_amount || '',
    loan_type: initialData?.loan_type || 'PERSONAL',
    start_date: initialData?.start_date || new Date().toISOString().split('T')[0],
    term_months: initialData?.term_months || 12,
})

export const formDataToDto = (formData: LoanFormData, endDate: string): CreateLoanDto => ({
    borrower_id: formData.borrower_id,
    interest_rate_id: formData.interest_rate_id,
    principal_amount: parseFloat(formData.principal_amount) || 0,
    loan_type: formData.loan_type,
    start_date: formData.start_date,
    end_date: endDate,
    term_months: formData.term_months,
})
