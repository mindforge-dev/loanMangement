import { User } from './user.entity';
import { AppDataSource } from '../../config/datasource';
import { BaseRepository } from '../../common/base/baseRepository';

export class UserRepository extends BaseRepository<User> {
    constructor() {
        super(AppDataSource.getRepository(User));
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.repo.findOne({ where: { email } });
    }

    async findWithRelationsByEmail(email: string): Promise<User | null> {
        return this.repo
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'role')
            .leftJoinAndSelect('role.permissions', 'rp')
            .leftJoinAndSelect('user.permissions', 'up')
            .where('user.email = :email', { email })
            .getOne();
    }

    async findWithRelationsById(id: string): Promise<User | null> {
        return this.repo
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'role')
            .leftJoinAndSelect('role.permissions', 'rp')
            .leftJoinAndSelect('user.permissions', 'up')
            .where('user.id = :id', { id })
            .getOne();
    }
}

export const userRepository = new UserRepository();
