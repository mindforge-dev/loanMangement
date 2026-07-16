import { PaginatedResult, PaginationParams } from "../../pagination/pagination.core";

export interface ICrudService<T> {
    create(data: T): Promise<T>;
    findAll(): Promise<T[]>;
    findAllPaginated?(pagination: PaginationParams): Promise<PaginatedResult<T>>;
    findById(id: string): Promise<T | null>;
    update(id: string, data: T): Promise<T | null>;
    delete(id: string): Promise<void>;
}
