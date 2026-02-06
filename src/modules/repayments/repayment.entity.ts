import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Loan } from "../loans/loan.entity";

@Entity("repayments")
export class Repayment {
    @PrimaryGeneratedColumn("uuid", { name: "payment_id" })
    id!: string;

    @Column()
    loan_id!: string;

    @ManyToOne(() => Loan)
    @JoinColumn({ name: "loan_id" })
    loan!: Loan;

    @Column("date")
    payment_date!: Date;

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
