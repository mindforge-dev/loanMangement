import type { CreateTransactionDto } from "../../services/transactionService";

export type TransactionFormData = {
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

export type TransactionFormErrors = Partial<Record<keyof TransactionFormData, string>>;
