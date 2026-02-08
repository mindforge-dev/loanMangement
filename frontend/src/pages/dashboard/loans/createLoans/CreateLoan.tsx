import { useState, useMemo } from 'react'
import { useCreateLoan } from '../../../../hooks/useLoans'
import { useBorrowers } from '../../../../hooks/useBorrowers'
import { useInterestRates } from '../../../../hooks/useInterestRates'
import type { CreateLoanDto } from '../../../../services/loanService'

interface CreateLoanProps {
    isOpen: boolean
    onClose: () => void
}

const LOAN_TYPES = ['PERSONAL', 'BUSINESS', 'MORTGAGE', 'AUTO'] as const

export default function CreateLoan({ isOpen, onClose }: CreateLoanProps) {
    const createLoanMutation = useCreateLoan()
    const { data: borrowers = [], isLoading: borrowersLoading } = useBorrowers()
    const { data: interestRates = [], isLoading: ratesLoading } = useInterestRates()

    const [borrowerId, setBorrowerId] = useState('')
    const [interestRateId, setInterestRateId] = useState('')
    const [principalAmount, setPrincipalAmount] = useState('')
    const [loanType, setLoanType] = useState<'PERSONAL' | 'BUSINESS' | 'MORTGAGE' | 'AUTO'>('PERSONAL')
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
    const [termMonths, setTermMonths] = useState(12)

    const [errors, setErrors] = useState<Partial<Record<keyof CreateLoanDto, string>>>({})

    // Calculate end date based on start date and term months (derived value)
    const endDate = useMemo(() => {
        if (startDate && termMonths) {
            const start = new Date(startDate)
            const end = new Date(start)
            end.setMonth(end.getMonth() + termMonths)
            return end.toISOString().split('T')[0]
        }
        return ''
    }, [startDate, termMonths])

    // Form data object for submission
    const formData: CreateLoanDto = useMemo(() => ({
        borrower_id: borrowerId,
        interest_rate_id: interestRateId,
        principal_amount: principalAmount,
        loan_type: loanType,
        start_date: startDate,
        end_date: endDate,
        term_months: termMonths,
    }), [borrowerId, interestRateId, principalAmount, loanType, startDate, endDate, termMonths])

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof CreateLoanDto, string>> = {}

        if (!formData.borrower_id) newErrors.borrower_id = 'Borrower is required'
        if (!formData.interest_rate_id) newErrors.interest_rate_id = 'Interest rate is required'
        if (!formData.principal_amount || parseFloat(formData.principal_amount) <= 0) {
            newErrors.principal_amount = 'Principal amount must be greater than 0'
        }
        if (!formData.start_date) newErrors.start_date = 'Start date is required'
        if (!formData.end_date) newErrors.end_date = 'End date is required'
        if (formData.term_months < 1) newErrors.term_months = 'Term must be at least 1 month'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const resetForm = () => {
        setBorrowerId('')
        setInterestRateId('')
        setPrincipalAmount('')
        setLoanType('PERSONAL')
        setStartDate(new Date().toISOString().split('T')[0])
        setTermMonths(12)
        setErrors({})
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        try {
            await createLoanMutation.mutateAsync(formData)
            resetForm()
            onClose()
        } catch (error) {
            console.error('Failed to create loan:', error)
        }
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        // Update the appropriate state based on field name
        switch (name) {
            case 'borrower_id':
                setBorrowerId(value)
                break
            case 'interest_rate_id':
                setInterestRateId(value)
                break
            case 'principal_amount':
                setPrincipalAmount(value)
                break
            case 'loan_type':
                setLoanType(value as 'PERSONAL' | 'BUSINESS' | 'MORTGAGE' | 'AUTO')
                break
            case 'start_date':
                setStartDate(value)
                break
            case 'term_months':
                setTermMonths(parseInt(value) || 0)
                break
        }

        // Clear error for this field
        if (errors[name as keyof CreateLoanDto]) {
            setErrors(prev => ({ ...prev, [name]: undefined }))
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative px-8 pt-8 pb-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Create New Loan
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Fill in the details to create a new loan application
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-8 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Borrower */}
                            <div className="md:col-span-2">
                                <label htmlFor="borrower_id" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Borrower <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="borrower_id"
                                    name="borrower_id"
                                    value={borrowerId}
                                    onChange={handleChange}
                                    disabled={borrowersLoading}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.borrower_id ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                        } focus:ring-2 focus:border-transparent transition-all outline-none`}
                                >
                                    <option value="">Select a borrower</option>
                                    {borrowers.map((borrower) => (
                                        <option key={borrower.id} value={borrower.id}>
                                            {borrower.full_name} - {borrower.email}
                                        </option>
                                    ))}
                                </select>
                                {errors.borrower_id && (
                                    <p className="mt-1 text-sm text-red-500">{errors.borrower_id}</p>
                                )}
                            </div>

                            {/* Interest Rate */}
                            <div className="md:col-span-2">
                                <label htmlFor="interest_rate_id" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Interest Rate <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="interest_rate_id"
                                    name="interest_rate_id"
                                    value={interestRateId}
                                    onChange={handleChange}
                                    disabled={ratesLoading}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.interest_rate_id ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                        } focus:ring-2 focus:border-transparent transition-all outline-none`}
                                >
                                    <option value="">Select an interest rate</option>
                                    {interestRates.map((rate) => (
                                        <option key={rate.id} value={rate.id}>
                                            {rate.rate_type} - {rate.rate_value}%
                                        </option>
                                    ))}
                                </select>
                                {errors.interest_rate_id && (
                                    <p className="mt-1 text-sm text-red-500">{errors.interest_rate_id}</p>
                                )}
                            </div>

                            {/* Principal Amount */}
                            <div>
                                <label htmlFor="principal_amount" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Principal Amount <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                                    <input
                                        type="number"
                                        id="principal_amount"
                                        name="principal_amount"
                                        value={principalAmount}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        className={`w-full pl-8 pr-4 py-3 rounded-lg border ${errors.principal_amount ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                            } focus:ring-2 focus:border-transparent transition-all outline-none`}
                                    />
                                </div>
                                {errors.principal_amount && (
                                    <p className="mt-1 text-sm text-red-500">{errors.principal_amount}</p>
                                )}
                            </div>

                            {/* Loan Type */}
                            <div>
                                <label htmlFor="loan_type" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Loan Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="loan_type"
                                    name="loan_type"
                                    value={loanType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                >
                                    {LOAN_TYPES.map((type) => (
                                        <option key={type} value={type}>
                                            {type.charAt(0) + type.slice(1).toLowerCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Term Months */}
                            <div>
                                <label htmlFor="term_months" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Term (Months) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="term_months"
                                    name="term_months"
                                    value={termMonths}
                                    onChange={handleChange}
                                    min="1"
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.term_months ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                        } focus:ring-2 focus:border-transparent transition-all outline-none`}
                                />
                                {errors.term_months && (
                                    <p className="mt-1 text-sm text-red-500">{errors.term_months}</p>
                                )}
                            </div>

                            {/* Start Date */}
                            <div>
                                <label htmlFor="start_date" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Start Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="start_date"
                                    name="start_date"
                                    value={startDate}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.start_date ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                        } focus:ring-2 focus:border-transparent transition-all outline-none`}
                                />
                                {errors.start_date && (
                                    <p className="mt-1 text-sm text-red-500">{errors.start_date}</p>
                                )}
                            </div>

                            {/* End Date (Auto-calculated) */}
                            <div>
                                <label htmlFor="end_date" className="block text-sm font-semibold text-gray-700 mb-2">
                                    End Date <span className="text-xs text-gray-500">(Auto-calculated)</span>
                                </label>
                                <input
                                    type="date"
                                    id="end_date"
                                    name="end_date"
                                    value={endDate}
                                    readOnly
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {createLoanMutation.isError && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">
                                    Failed to create loan. Please try again.
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="mt-8 flex gap-4 justify-end">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={createLoanMutation.isPending}
                                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createLoanMutation.isPending}
                                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {createLoanMutation.isPending ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Create Loan
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
