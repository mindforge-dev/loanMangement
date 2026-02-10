import { useMemo, useState } from "react";
import { useBorrowers } from "../../../hooks/useBorrowers";
import { useLoansByBorrower } from "../../../hooks/useLoans";
import { useCreateTransaction } from "../../../hooks/useTransactions";
import type { CreateTransactionDto } from "../../../services/transactionService";

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type FormData = {
  loan_id: string;
  payment_date: string;
  borrower_id: string;
  type: CreateTransactionDto["type"];
  amount_paid: string;
  remaining_balance: string;
  payment_term_months: string;
  method: string;
  note: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialFormData: FormData = {
  loan_id: "",
  payment_date: "",
  borrower_id: "",
  type: "REPAYMENT",
  amount_paid: "",
  remaining_balance: "",
  payment_term_months: "",
  method: "",
  note: "",
};

export default function TransactionFormModal({
  isOpen,
  onClose,
  onSuccess,
}: TransactionFormModalProps) {
  const createTransactionMutation = useCreateTransaction();
  const { data: borrowersResponse, isLoading: borrowersLoading } = useBorrowers(
    { page: 1, limit: 1000 },
  );

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  const { data: loansByBorrowerResponse, isLoading: loansLoading } =
    useLoansByBorrower(formData.borrower_id);

  const borrowers = useMemo(
    () => borrowersResponse?.data || [],
    [borrowersResponse?.data],
  );
  const loans = useMemo(
    () => loansByBorrowerResponse?.data || [],
    [loansByBorrowerResponse?.data],
  );

  const borrowerNameMap = useMemo(() => {
    const map = new Map<string, string>();
    borrowers.forEach((borrower) => {
      map.set(borrower.id, borrower.full_name);
    });
    return map;
  }, [borrowers]);

  // Auto-select if only one loan
  const [prevLoans, setPrevLoans] = useState(loans);
  if (loans !== prevLoans) {
    setPrevLoans(loans);
    if (loans.length === 1 && !formData.loan_id) {
      setFormData((prev) => ({ ...prev, loan_id: loans[0].id }));
    }
  }

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "borrower_id") {
        updated.loan_id = "";
      }
      return updated;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const resetAndClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.loan_id) newErrors.loan_id = "Loan is required";
    if (!formData.borrower_id) newErrors.borrower_id = "Borrower is required";
    if (!formData.payment_date)
      newErrors.payment_date = "Payment date is required";
    if (!formData.method.trim()) newErrors.method = "Method is required";

    const amountPaid = Number(formData.amount_paid);
    if (!formData.amount_paid || Number.isNaN(amountPaid) || amountPaid < 0) {
      newErrors.amount_paid = "Amount paid must be a valid number (>= 0)";
    }

    const remainingBalance = Number(formData.remaining_balance);
    if (
      !formData.remaining_balance ||
      Number.isNaN(remainingBalance) ||
      remainingBalance < 0
    ) {
      newErrors.remaining_balance =
        "Remaining balance must be a valid number (>= 0)";
    }

    const termMonths = Number(formData.payment_term_months);
    if (
      !formData.payment_term_months ||
      !Number.isInteger(termMonths) ||
      termMonths < 1
    ) {
      newErrors.payment_term_months =
        "Payment term must be a whole number (>= 1)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload: CreateTransactionDto = {
      loan_id: formData.loan_id,
      payment_date: formData.payment_date,
      borrower_id: formData.borrower_id,
      type: formData.type,
      amount_paid: Number(formData.amount_paid),
      remaining_balance: Number(formData.remaining_balance),
      payment_term_months: Number(formData.payment_term_months),
      method: formData.method.trim(),
      note: formData.note.trim() || undefined,
    };

    try {
      await createTransactionMutation.mutateAsync(payload);
      resetAndClose();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create transaction:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={resetAndClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative px-8 pt-8 pb-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  Add Transaction
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Fill in the details to record a new transaction
                </p>
              </div>
              <button
                onClick={resetAndClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                disabled={createTransactionMutation.isPending}
              >
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="borrower_id"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Borrower <span className="text-red-500">*</span>
                </label>
                <select
                  id="borrower_id"
                  value={formData.borrower_id}
                  onChange={(e) => updateField("borrower_id", e.target.value)}
                  disabled={borrowersLoading}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.borrower_id ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                >
                  <option value="">Select borrower</option>
                  {borrowers.map((borrower) => (
                    <option key={borrower.id} value={borrower.id}>
                      {borrower.full_name}
                    </option>
                  ))}
                </select>
                {errors.borrower_id && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.borrower_id}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="loan_id"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Loan <span className="text-red-500">*</span>
                </label>
                <select
                  id="loan_id"
                  value={formData.loan_id}
                  onChange={(e) => updateField("loan_id", e.target.value)}
                  disabled={loansLoading || !formData.borrower_id}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.loan_id ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                >
                  <option value="">Select loan</option>
                  {loans.map((loan) => (
                    <option key={loan.id} value={loan.id}>
                      {`${borrowerNameMap.get(loan.borrower_id) || "Unknown"} - ${loan.id.slice(0, 8)}...`}
                    </option>
                  ))}
                </select>
                {errors.loan_id && (
                  <p className="mt-1 text-sm text-red-500">{errors.loan_id}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="payment_date"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Payment Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="payment_date"
                  type="date"
                  value={formData.payment_date}
                  onChange={(e) => updateField("payment_date", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.payment_date ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                />
                {errors.payment_date && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.payment_date}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    updateField(
                      "type",
                      e.target.value as CreateTransactionDto["type"],
                    )
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="REPAYMENT">REPAYMENT</option>
                  <option value="DISBURSEMENT">DISBURSEMENT</option>
                  <option value="FEE">FEE</option>
                  <option value="PENALTY">PENALTY</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="amount_paid"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Amount Paid <span className="text-red-500">*</span>
                </label>
                <input
                  id="amount_paid"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount_paid}
                  onChange={(e) => updateField("amount_paid", e.target.value)}
                  placeholder="500"
                  className={`w-full px-4 py-3 rounded-lg border ${errors.amount_paid ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                />
                {errors.amount_paid && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.amount_paid}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="remaining_balance"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Remaining Balance <span className="text-red-500">*</span>
                </label>
                <input
                  id="remaining_balance"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.remaining_balance}
                  onChange={(e) =>
                    updateField("remaining_balance", e.target.value)
                  }
                  placeholder="1000"
                  className={`w-full px-4 py-3 rounded-lg border ${errors.remaining_balance ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                />
                {errors.remaining_balance && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.remaining_balance}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="payment_term_months"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Payment Term Months <span className="text-red-500">*</span>
                </label>
                <input
                  id="payment_term_months"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.payment_term_months}
                  onChange={(e) =>
                    updateField("payment_term_months", e.target.value)
                  }
                  placeholder="12"
                  className={`w-full px-4 py-3 rounded-lg border ${errors.payment_term_months ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                />
                {errors.payment_term_months && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.payment_term_months}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="method"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Method <span className="text-red-500">*</span>
                </label>
                <input
                  id="method"
                  type="text"
                  value={formData.method}
                  onChange={(e) => updateField("method", e.target.value)}
                  placeholder="Bank Transfer"
                  className={`w-full px-4 py-3 rounded-lg border ${errors.method ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                />
                {errors.method && (
                  <p className="mt-1 text-sm text-red-500">{errors.method}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="note"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Note
                </label>
                <textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) => updateField("note", e.target.value)}
                  rows={3}
                  placeholder="Monthly installment"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {createTransactionMutation.isError && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  Failed to create transaction. Please try again.
                </p>
              </div>
            )}

            <div className="mt-8 flex gap-4 justify-end">
              <button
                type="button"
                onClick={resetAndClose}
                disabled={createTransactionMutation.isPending}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createTransactionMutation.isPending}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {createTransactionMutation.isPending ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create Transaction
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
