"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserRepository = void 0;
const user_entity_1 = require("./user.entity");
const datasource_1 = require("../../config/datasource");
class UserRepository {
    constructor() {
        this.repo = datasource_1.AppDataSource.getRepository(user_entity_1.User);
    }
    async findByEmail(email) {
        return this.repo.findOne({ where: { email } });
    }
    async findById(id) {
        return this.repo.findOne({ where: { id } });
    }
    async create(userData) {
        const user = this.repo.create(userData);
        return this.repo.save(user);
    }
    async findAll() {
        return this.repo.find();
    }
}
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();
