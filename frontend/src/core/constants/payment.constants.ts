
import type { TransactionFormData } from "../types/payment.types";

export const initialTransactionFormData: TransactionFormData = {
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
