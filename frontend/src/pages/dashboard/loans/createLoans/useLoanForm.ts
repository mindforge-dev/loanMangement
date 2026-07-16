import { useState, useMemo, useCallback } from 'react'
import type { LoanFormData, LoanFormErrors } from './types'
import { getInitialFormData, formDataToDto } from './types'

export const useLoanForm = (initialData?: Partial<LoanFormData>) => {
    const [formData, setFormData] = useState<LoanFormData>(() => getInitialFormData(initialData))
    const [errors, setErrors] = useState<LoanFormErrors>({})

    // Calculate end date based on start date and term months (derived value)
    const endDate = useMemo(() => {
        if (formData.start_date && formData.term_months) {
            const start = new Date(formData.start_date)
            const end = new Date(start)
            end.setMonth(end.getMonth() + formData.term_months)
            return end.toISOString().split('T')[0]
        }
        return ''
    }, [formData.start_date, formData.term_months])

    // Create DTO for submission
    const loanDto = useMemo(() => formDataToDto(formData, endDate), [formData, endDate])

    // Update a single field
    const updateField = useCallback((field: keyof LoanFormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }, [errors])

    // Validate form
    const validateForm = useCallback((): boolean => {
        const newErrors: LoanFormErrors = {}

        if (!formData.borrower_id) newErrors.borrower_id = 'Borrower is required'
        if (!formData.interest_rate_id) newErrors.interest_rate_id = 'Interest rate is required'

        const amount = parseFloat(formData.principal_amount)
        if (!formData.principal_amount || isNaN(amount) || amount <= 0) {
            newErrors.principal_amount = 'Principal amount must be greater than 0'
        }

        if (!formData.start_date) newErrors.start_date = 'Start date is required'
        if (!endDate) newErrors.end_date = 'End date is required'
        if (formData.term_months < 1) newErrors.term_months = 'Term must be at least 1 month'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }, [formData, endDate])

    // Reset form
    const resetForm = useCallback(() => {
        setFormData(getInitialFormData(initialData))
        setErrors({})
    }, [initialData])

    return {
        formData,
        setFormData,
        errors,
        endDate,
        loanDto,
        updateField,
        validateForm,
        resetForm,
    }
}
