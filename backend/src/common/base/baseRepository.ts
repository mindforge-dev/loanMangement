import { Repository, ObjectLiteral, DeepPartial } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import {
    PaginatedResult,
    PaginationCore,
    PaginationParams,
} from "../pagination/pagination.core";

export class BaseRepository<T extends ObjectLiteral> {
    constructor(protected repo: Repository<T>) { }

    async create(data: DeepPartial<T>): Promise<T> {
        return this.repo.save(data);
    }

    async findAll(): Promise<T[]> {
        return this.repo.find();
    }

    async findAllPaginated(
        pagination: PaginationParams,
    ): Promise<PaginatedResult<T>> {
        const { page, limit } = pagination;
        let [data, total] = await this.repo.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
        });
        const effectivePage = PaginationCore.clampPage(page, total, limit);

        if (effectivePage !== page) {
            [data, total] = await this.repo.findAndCount({
                skip: (effectivePage - 1) * limit,
                take: limit,
            });
        }

        return {
            data,
            meta: PaginationCore.buildMeta(total, effectivePage, limit),
        };
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
