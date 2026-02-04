import { userRepository, UserRepository } from './users.repository';
import { User } from './user.entity';

export class UserService {
    private userRepo: UserRepository;

    constructor() {
        this.userRepo = userRepository;
    }

    async getUserById(id: string): Promise<User | null> {
        return this.userRepo.findById(id);
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepo.findAll();
    }
}

export const userService = new UserService();
