import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("borrowers")
export class Borrower {
  @PrimaryGeneratedColumn("uuid", { name: "borrower_id" })
  id!: string;

  @Column()
  full_name!: string;

  @Column()
  phone!: string;

  @Column()
  email!: string;

  @Column("text")
  address!: string;

  @Column()
  nrc!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
