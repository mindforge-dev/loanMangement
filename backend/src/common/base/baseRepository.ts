import { Repository, ObjectLiteral, DeepPartial } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export class BaseRepository<T extends ObjectLiteral> {
    constructor(protected repo: Repository<T>) { }

    async create(data: DeepPartial<T>): Promise<T> {
        return this.repo.save(data);
    }

    async findAll(): Promise<T[]> {
        return this.repo.find();
    }

    async findById(id: string): Promise<T | null> {
        return this.repo.findOne({ where: { id } as any });
    }

    async update(id: string, data: QueryDeepPartialEntity<T>): Promise<T | null> {
        await this.repo.update(id, data);
        return this.findById(id);
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }
}