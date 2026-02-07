import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum UserRole {
    ADMIN = 'ADMIN',
    LOAN_OFFICER = 'LOAN_OFFICER',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    passwordHash!: string;

    @Column({ type: 'simple-enum', enum: UserRole, default: UserRole.LOAN_OFFICER })
    role!: UserRole;

    @CreateDateColumn()
    createdAt!: Date;
}
