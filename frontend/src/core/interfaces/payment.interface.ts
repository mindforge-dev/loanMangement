import type { Transaction } from "../../services/transactionService";

export interface TransactionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export interface UseTransactionFormProps {
    onClose: () => void;
    onSuccess?: () => void;
}

export interface TransactionTableRow extends Transaction {
    borrower_name: string
}
