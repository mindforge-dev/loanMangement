import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Loan } from "../loans/loan.entity";
import { Borrower } from "../borrowers/borrower.entity";

export enum TransactionType {
    REPAYMENT = "REPAYMENT",
    LATE_FEE = "LATE_FEE",
    PENALTY = "PENALTY",
    OTHER = "OTHER"
}

@Entity("transactions")
export class Transaction {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    loan_id!: string;

    @ManyToOne(() => Loan)
    @JoinColumn({ name: "loan_id" })
    loan!: Loan;

    @Column({ nullable: true })
    borrower_id!: string;

    @ManyToOne(() => Borrower)
    @JoinColumn({ name: "borrower_id" })
    borrower!: Borrower;

    @Column("date")
    payment_date!: Date;

    @Column({
        type: "enum",
        enum: TransactionType,
        default: TransactionType.REPAYMENT
    })
    type!: TransactionType;

    @Column("decimal", { precision: 15, scale: 2 })
    amount_paid!: number;

    @Column("decimal", { precision: 15, scale: 2 })
    remaining_balance!: number;

    @Column("int")
    payment_term_months!: number;

    @Column({ type: "varchar", nullable: true })
    method?: string;

    @Column("text", { nullable: true })
    note?: string;

    @CreateDateColumn()
    created_at!: Date;
}
