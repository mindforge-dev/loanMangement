import { UserService } from './users.service';
import { UserRepository } from './users.repository';
import { User } from './user.entity';

// Mock the repository module
jest.mock('./users.repository', () => {
    return {
        userRepository: {
            findById: jest.fn(),
            findAll: jest.fn(),
        },
        UserRepository: jest.fn(),
    };
});

import { userRepository } from './users.repository';

describe('UserService', () => {
    let userService: UserService;
    const mockUserRepo = userRepository as jest.Mocked<UserRepository>;

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        userService = new UserService();
    });

    describe('getUserById', () => {
        it('should return a user if found', async () => {
            const mockUser = { id: '1', name: 'Test User' } as User;
            (mockUserRepo.findById as jest.Mock).mockResolvedValue(mockUser);

            const result = await userService.getUserById('1');

            expect(result).toEqual(mockUser);
            expect(mockUserRepo.findById).toHaveBeenCalledWith('1');
        });

        it('should return null if user not found', async () => {
            (mockUserRepo.findById as jest.Mock).mockResolvedValue(null);

            const result = await userService.getUserById('999');

            expect(result).toBeNull();
            expect(mockUserRepo.findById).toHaveBeenCalledWith('999');
        });
    });

    describe('getAllUsers', () => {
        it('should return an array of users', async () => {
            const mockUsers = [{ id: '1', name: 'Test User' }] as User[];
            (mockUserRepo.findAll as jest.Mock).mockResolvedValue(mockUsers);

            const result = await userService.getAllUsers();

            expect(result).toEqual(mockUsers);
            expect(mockUserRepo.findAll).toHaveBeenCalled();
        });
    });
});
