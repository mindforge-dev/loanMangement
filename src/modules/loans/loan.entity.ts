import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Borrower } from "../borrowers/borrower.entity";
import { InterestRate } from "../interest-rates/interest-rate.entity";

export enum LoanStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  DEFAULTED = "DEFAULTED",
  REJECTED = "REJECTED",
}

@Entity("loans")
export class Loan {
  @PrimaryGeneratedColumn("uuid", { name: "loan_id" })
  id!: string;

  @Column()
  borrower_id!: string;

  @ManyToOne(() => Borrower)
  @JoinColumn({ name: "borrower_id" })
  borrower!: Borrower;

  @Column()
  interest_rate_id!: string;

  @ManyToOne(() => InterestRate)
  @JoinColumn({ name: "interest_rate_id" })
  interest_rate!: InterestRate;

  @Column("decimal", { precision: 15, scale: 2 })
  principal_amount!: number;

  @Column()
  loan_type!: string;

  @Column("date")
  start_date!: Date;

  @Column("date")
  end_date!: Date;

  @Column("int")
  term_months!: number;

  @Column("decimal", { precision: 5, scale: 2 })
  interest_rate_snapshot!: number;

  @Column("decimal", { precision: 15, scale: 2 })
  current_balance!: number;

  @Column({ type: "varchar", default: LoanStatus.PENDING })
  status!: LoanStatus;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
