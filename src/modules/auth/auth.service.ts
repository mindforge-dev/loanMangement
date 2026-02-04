import bcrypt from 'bcrypt';
import { userRepository, UserRepository } from '../users/users.repository';
import { signToken } from '../../common/utils/jwt';
import { BadRequestError, UnauthorizedError } from '../../common/errors/http-errors';
import { RegisterDTO, LoginDTO } from './auth.types';
import { UserRole } from '../users/user.entity';

export class AuthService {
    private userRepo: UserRepository;

    constructor() {
        this.userRepo = userRepository;
    }

    async register(data: RegisterDTO) {
        const existingUser = await this.userRepo.findByEmail(data.email);
        if (existingUser) {
            throw new BadRequestError('User already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.userRepo.create({
            ...data,
            passwordHash: hashedPassword,
            role: data.role || UserRole.LOAN_OFFICER,
        });

        const token = signToken({ userId: user.id, role: user.role });

        // safe user object
        const { passwordHash, ...safeUser } = user;
        return { user: safeUser, token };
    }

    async login(data: LoginDTO) {
        const user = await this.userRepo.findByEmail(data.email);
        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(data.password, user.passwordHash);
        if (!isMatch) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const token = signToken({ userId: user.id, role: user.role });

        const { passwordHash, ...safeUser } = user;
        return { user: safeUser, token };
    }
}

export const authService = new AuthService();
