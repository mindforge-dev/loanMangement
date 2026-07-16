import type { LoanFormData, LoanFormErrors } from './types'
import { LOAN_TYPES } from './types'
import type { Borrower } from '../../../../services/borrowerService'
import type { InterestRate } from '../../../../services/interestRateService'

interface LoanFormFieldsProps {
    formData: LoanFormData
    errors: LoanFormErrors
    endDate: string
    borrowers: Borrower[]
    interestRates: InterestRate[]
    borrowersLoading: boolean
    ratesLoading: boolean
    onChange: (field: keyof LoanFormData, value: string | number) => void
}

export default function LoanFormFields({
    formData,
    errors,
    endDate,
    borrowers,
    interestRates,
    borrowersLoading,
    ratesLoading,
    onChange,
}: LoanFormFieldsProps) {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        if (name === 'term_months') {
            onChange(name, parseInt(value) || 0)
        } else {
            onChange(name as keyof LoanFormData, value)
        }
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {/* Borrower */}
            <div>
                <label htmlFor="borrower_id" className="block text-sm font-semibold text-gray-700 mb-2">
                    Borrower <span className="text-red-500">*</span>
                </label>
                <select
                    id="borrower_id"
                    name="borrower_id"
                    value={formData.borrower_id}
                    onChange={handleInputChange}
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
            <div>
                <label htmlFor="interest_rate_id" className="block text-sm font-semibold text-gray-700 mb-2">
                    Interest Rate <span className="text-red-500">*</span>
                </label>
                <select
                    id="interest_rate_id"
                    name="interest_rate_id"
                    value={formData.interest_rate_id}
                    onChange={handleInputChange}
                    disabled={ratesLoading}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.interest_rate_id ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        } focus:ring-2 focus:border-transparent transition-all outline-none`}
                >
                    <option value="">Select an interest rate</option>
                    {interestRates
                        .filter(rate => rate.is_active)
                        .map((rate) => (
                            <option key={rate.id} value={rate.id}>
                                {rate.rate_percent}% Annual Rate
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
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">MMK</span>
                    <input
                        type="number"
                        id="principal_amount"
                        name="principal_amount"
                        value={formData.principal_amount}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className={`w-full pl-16 pr-4 py-3 rounded-lg border ${errors.principal_amount ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
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
                    value={formData.loan_type}
                    onChange={handleInputChange}
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
                    value={formData.term_months}
                    onChange={handleInputChange}
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
                    value={formData.start_date}
                    onChange={handleInputChange}
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
    )
}
