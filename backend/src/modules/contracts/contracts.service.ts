import { ICrudService } from "../../common/base/interfaces/service";
import { Contract } from "./contract.entity";
import { contractRepository, ContractRepository } from "./contracts.repository";
import { deleteFile } from "../../common/services/storage.service";
import {
    PaginatedResult,
    PaginationParams,
} from "../../common/pagination/pagination.core";

export class ContractService implements ICrudService<Contract> {
    private contractRepo: ContractRepository;

    constructor() {
        this.contractRepo = contractRepository;
    }

    async create(data: Partial<Contract>): Promise<Contract> {
        return this.contractRepo.create(data);
    }

    async findAll(): Promise<Contract[]> {
        return this.contractRepo.findAll();
    }

    async findAllPaginated(
        pagination: PaginationParams,
    ): Promise<PaginatedResult<Contract>> {
        return this.contractRepo.findAllPaginated(pagination);
    }

    async findById(id: string): Promise<Contract | null> {
        return this.contractRepo.findById(id);
    }

    async update(id: string, data: Partial<Contract>): Promise<Contract | null> {
        return this.contractRepo.update(id, data as any);
    }

    async delete(id: string): Promise<void> {
        const contract = await this.contractRepo.findById(id);
        if (contract?.object_key) {
            try {
                await deleteFile(contract.object_key);
            } catch (err) {
                console.error("Failed to delete object from MinIO:", err);
            }
        }
        return this.contractRepo.delete(id);
    }

    async findByLoan(loanId: string): Promise<Contract[]> {
        return this.contractRepo.findByLoanId(loanId);
    }
}

export const contractService = new ContractService();
