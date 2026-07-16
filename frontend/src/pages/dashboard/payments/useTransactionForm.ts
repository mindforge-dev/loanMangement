import { useState } from "react";
import { useCreateTransaction } from "../../../hooks/useTransactions";
import type { CreateTransactionDto } from "../../../services/transactionService";
import type {
    TransactionFormData,
    TransactionFormErrors,
} from "../../../core/types/payment.types";
import type { UseTransactionFormProps } from "../../../core/interfaces/payment.interface";
import { initialTransactionFormData } from "../../../core/constants/payment.constants";

export type { CreateTransactionDto };

export const useTransactionForm = ({
    onClose,
    onSuccess,
}: UseTransactionFormProps) => {
    const createTransactionMutation = useCreateTransaction();
    const [formData, setFormData] = useState<TransactionFormData>(
        initialTransactionFormData,
    );
    const [errors, setErrors] = useState<TransactionFormErrors>({});

    const updateField = (field: keyof TransactionFormData, value: string) => {
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

    const setLoanId = (loanId: string) => {
        setFormData((prev) => ({ ...prev, loan_id: loanId }));
    };

    const resetAndClose = () => {
        setFormData(initialTransactionFormData);
        setErrors({});
        onClose();
    };

    const validateForm = (): boolean => {
        const newErrors: TransactionFormErrors = {};

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

    return {
        formData,
        errors,
        updateField,
        setLoanId,
        handleSubmit,
        resetAndClose,
        isSubmitting: createTransactionMutation.isPending,
        isError: createTransactionMutation.isError,
    };
};
