import bcrypt from 'bcryptjs';
import { userRepository, UserRepository } from './users.repository';
import { User } from './user.entity';
import { authService } from '../auth/auth.service';
import { BadRequestError } from '../../common/errors/http-errors';
import { ICrudService } from '../../common/base/interfaces/service';
import {
    PaginatedResult,
    PaginationParams,
} from '../../common/pagination/pagination.core';

export class UserService implements ICrudService<User> {
    private userRepo: UserRepository;

    constructor() {
        this.userRepo = userRepository;
    }

    async createUserManual(data: { name: string; email: string; password?: string; roles?: string[] }): Promise<User> {
        const existingUser = await this.userRepo.findByEmail(data.email);
        if (existingUser) {
            throw new BadRequestError('User already exists');
        }

        const password = data.password || 'TemporaryPassword123!';
        const passwordHash = await bcrypt.hash(password, 10);

        const created = await this.userRepo.create({
            name: data.name,
            email: data.email,
            passwordHash,
        });

        const rolesToAssign = data.roles && data.roles.length > 0 ? data.roles : ['loan-officer'];
        await authService.assignRoles(created.id, rolesToAssign);

        return (await this.findById(created.id))!;
    }

    async create(data: Partial<User>): Promise<User> {
        return this.userRepo.create(data);
    }

    async findAll(): Promise<User[]> {
        return this.userRepo.findAll();
    }

    async findAllWithRelations(): Promise<User[]> {
        return this.userRepo.findAllWithRelations();
    }

    async findAllPaginated(
        pagination: PaginationParams,
    ): Promise<PaginatedResult<User>> {
        return this.userRepo.findAllPaginated(pagination);
    }

    async findById(id: string): Promise<User | null> {
        return this.userRepo.findById(id);
    }

    async update(id: string, data: Partial<User>): Promise<User | null> {
        return this.userRepo.update(id, data);
    }

    async delete(id: string): Promise<void> {
        return this.userRepo.delete(id);
    }

    // Alias for existing codebase compatibility
    async getUserById(id: string): Promise<User | null> {
        return this.findById(id);
    }

    async getAllUsers(): Promise<User[]> {
        return this.findAll();
    }
}

export const userService = new UserService();
