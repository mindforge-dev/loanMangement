import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Loan } from "../loans/loan.entity";

@Entity("contracts")
export class Contract {
    @PrimaryGeneratedColumn("uuid", { name: "contract_id" })
    id!: string;

    @Column()
    loan_id!: string;

    @ManyToOne(() => Loan)
    @JoinColumn({ name: "loan_id" })
    loan!: Loan;

    /** S3/MinIO object key (replaces local file_path). */
    @Column()
    object_key!: string;

    @Column()
    original_file_name!: string;

    @Column()
    mime_type!: string;

    @Column("int")
    size!: number;

    @Column("date")
    signing_date!: Date;

    @CreateDateColumn()
    created_at!: Date;
}
