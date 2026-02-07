import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("interest_rates")
export class InterestRate {
  @PrimaryGeneratedColumn("uuid", { name: "interest_rate_id" })
  id!: string;

  @Column("int")
  rate_percent!: number;

  @Column({ default: true })
  is_active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
