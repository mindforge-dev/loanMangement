import bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { LessThan } from 'typeorm';
import { userRepository } from '../users/users.repository';
import { AppDataSource } from '../../config/datasource';
import { Role } from '../rbac/entities/role.entity';
import { Permission } from '../rbac/entities/permission.entity';
import { RefreshToken } from '../rbac/entities/refresh-token.entity';
import { User } from '../users/user.entity';
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from '../../common/utils/jwt';
import {
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
} from '../../common/errors/http-errors';
import type { UserWithPermissions } from '../rbac/rbac.types';
import type { RegisterDTO, LoginDTO } from './auth.types';

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const DEFAULT_ROLE = 'loan-officer';

export class AuthService {
    private userRepo = userRepository;
    private roleRepo = AppDataSource.getRepository(Role);
    private permissionRepo = AppDataSource.getRepository(Permission);
    private refreshTokenRepo = AppDataSource.getRepository(RefreshToken);

    // ── Authentication ──

    async validateUser(email: string, password: string): Promise<UserWithPermissions | null> {
        const user = await this.userRepo.findWithRelationsByEmail(email);
        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return null;

        return this.toUserWithPermissions(user);
    }

    async login(data: LoginDTO) {
        const user = await this.validateUser(data.email, data.password);
        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }
        return this.issueTokens(user);
    }

    async register(data: RegisterDTO) {
        const existingUser = await this.userRepo.findByEmail(data.email);
        if (existingUser) {
            throw new BadRequestError('User already exists');
        }

        const passwordHash = await bcrypt.hash(data.password, 10);
        const created = await this.userRepo.create({
            name: data.name,
            email: data.email,
            passwordHash,
        });

        // Assign the default role (never trust a client-supplied role)
        await this.assignRoles(created.id, [DEFAULT_ROLE]);

        const user = await this.getUserWithPermissions(created.id);
        return this.issueTokens(user!);
    }

    async refreshAccessToken(refreshToken: string) {
        let payload: { sub: string };
        try {
            payload = verifyRefreshToken(refreshToken);
        } catch {
            throw new UnauthorizedError('Invalid or expired refresh token');
        }

        const tokenHash = this.hashToken(refreshToken);
        const storedToken = await this.refreshTokenRepo.findOne({ where: { tokenHash } });

        if (!storedToken) {
            throw new UnauthorizedError('Refresh token not found');
        }

        if (storedToken.isRevoked) {
            // Reuse detected — revoke every token for this user
            await this.revokeAllUserRefreshTokens(payload.sub);
            throw new UnauthorizedError('Refresh token was revoked');
        }

        if (storedToken.expiresAt < new Date()) {
            await this.refreshTokenRepo.update(storedToken.id, { isRevoked: true });
            throw new UnauthorizedError('Refresh token has expired');
        }

        // Rotate: invalidate the old refresh token
        await this.refreshTokenRepo.update(storedToken.id, { isRevoked: true });

        const user = await this.getUserWithPermissions(payload.sub);
        if (!user) {
            throw new UnauthorizedError('User not found');
        }

        return this.issueTokens(user);
    }

    async revokeRefreshToken(refreshToken: string): Promise<void> {
        const tokenHash = this.hashToken(refreshToken);
        const storedToken = await this.refreshTokenRepo.findOne({ where: { tokenHash } });
        if (storedToken) {
            await this.refreshTokenRepo.update(storedToken.id, { isRevoked: true });
        }
    }

    async revokeAllUserRefreshTokens(userId: string): Promise<void> {
        await this.refreshTokenRepo.update(
            { userId, isRevoked: false },
            { isRevoked: true },
        );
    }

    async cleanExpiredRefreshTokens(): Promise<number> {
        const result = await this.refreshTokenRepo.delete({ expiresAt: LessThan(new Date()) });
        return result.affected ?? 0;
    }

    // ── User / Role / Permission Queries ──

    async getUserWithPermissions(id: string): Promise<UserWithPermissions | null> {
        const user = await this.userRepo.findWithRelationsById(id);
        return user ? this.toUserWithPermissions(user) : null;
    }

    async getAllRoles(): Promise<Role[]> {
        return this.roleRepo.find({ order: { id: 'ASC' } });
    }

    async getAllPermissions(): Promise<Permission[]> {
        return this.permissionRepo.find({ order: { id: 'ASC' } });
    }

    async assignRoles(userId: string, roleNames: string[]): Promise<UserWithPermissions | null> {
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({
            where: { id: userId },
            relations: ["roles", "permissions"],
        });
        if (!user) throw new NotFoundError("User not found");

        const roleEntities = roleNames.length
            ? await this.roleRepo.find({ where: roleNames.map((name) => ({ name })) })
            : [];
        user.roles = roleEntities;
        await userRepo.save(user);
        return this.getUserWithPermissions(userId);
    }

    async syncPermissions(
        userId: string,
        permissionNames: string[],
    ): Promise<UserWithPermissions | null> {
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({
            where: { id: userId },
            relations: ["roles", "permissions"],
        });
        if (!user) throw new NotFoundError("User not found");

        const permEntities = permissionNames.length
            ? await this.permissionRepo.find({ where: permissionNames.map((name) => ({ name })) })
            : [];
        user.permissions = permEntities;
        await userRepo.save(user);
        return this.getUserWithPermissions(userId);
    }

    // ── Token Helpers ──

    private issueTokens(user: UserWithPermissions) {
        const accessToken = signAccessToken(user);
        const refreshToken = signRefreshToken(user.id);
        const hash = this.hashToken(refreshToken);

        this.refreshTokenRepo.save({
            tokenHash: hash,
            userId: user.id,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
        });

        return { accessToken, refreshToken, user };
    }

    private hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    // ── Mappers ──

    private toUserWithPermissions(user: User): UserWithPermissions {
        const roleNames = (user.roles ?? []).map((r) => r.name);

        const permSet = new Set<string>();

        for (const role of user.roles ?? []) {
            for (const perm of role.permissions ?? []) {
                permSet.add(perm.name);
            }
        }

        for (const perm of user.permissions ?? []) {
            permSet.add(perm.name);
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            roles: roleNames,
            permissions: [...permSet],
        };
    }
}

// Local alias to keep the throw readable without an extra import
export const authService = new AuthService();
