import { useEffect } from 'react'
import { useCreateLoan, useUpdateLoan } from '../../../../hooks/useLoans'
import { useBorrowers } from '../../../../hooks/useBorrowers'
import { useInterestRates } from '../../../../hooks/useInterestRates'
import { useLoanForm } from './useLoanForm'
import LoanFormFields from './LoanFormFields'
import type { LoanFormProps } from './types'

export default function LoanFormModal({
    isOpen,
    onClose,
    initialData,
    loanId,
    mode = 'create'
}: LoanFormProps) {
    const createLoanMutation = useCreateLoan()
    const updateLoanMutation = useUpdateLoan()
    const { data: borrowers = [], isLoading: borrowersLoading } = useBorrowers()
    const { data: interestRates = [], isLoading: ratesLoading } = useInterestRates()

    const {
        formData,
        errors,
        endDate,
        loanDto,
        updateField,
        validateForm,
        resetForm,
    } = useLoanForm(initialData)

    // Reset form when modal opens with new data
    useEffect(() => {
        if (isOpen && initialData) {
            resetForm()
        }
    }, [isOpen, initialData, resetForm])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        try {
            if (mode === 'edit' && loanId) {
                await updateLoanMutation.mutateAsync({ id: loanId, data: loanDto })
            } else {
                await createLoanMutation.mutateAsync(loanDto)
            }
            resetForm()
            onClose()
        } catch (error) {
            console.error(`Failed to ${mode} loan:`, error)
        }
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    const mutation = mode === 'edit' ? updateLoanMutation : createLoanMutation
    const isSubmitting = mutation.isPending

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
                                    {mode === 'edit' ? 'Edit Loan' : 'Create New Loan'}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    {mode === 'edit'
                                        ? 'Update the loan details below'
                                        : 'Fill in the details to create a new loan application'}
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
                        <LoanFormFields
                            formData={formData}
                            errors={errors}
                            endDate={endDate}
                            borrowers={borrowers}
                            interestRates={interestRates}
                            borrowersLoading={borrowersLoading}
                            ratesLoading={ratesLoading}
                            onChange={updateField}
                        />

                        {/* Error Message */}
                        {mutation.isError && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">
                                    Failed to {mode} loan. Please try again.
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="mt-8 flex gap-4 justify-end">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {mode === 'edit' ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mode === 'edit' ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} />
                                        </svg>
                                        {mode === 'edit' ? 'Update Loan' : 'Create Loan'}
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
