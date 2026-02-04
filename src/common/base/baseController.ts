import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../errors/http-errors';
import { ICrudService } from './interfaces/service';

export abstract class BaseController<T> {
    constructor(protected service: ICrudService<T>) { }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.service.create(req.body);
            res.status(201).json({ data });
        } catch (error) {
            next(error);
        }
    };

    findAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.service.findAll();
            res.json({ data });
        } catch (error) {
            next(error);
        }
    };

    findById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = await this.service.findById(id);
            if (!data) {
                throw new NotFoundError('Resource not found');
            }
            res.json({ data });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = await this.service.update(id, req.body);
            if (!data) {
                throw new NotFoundError('Resource not found');
            }
            res.json({ data });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            await this.service.delete(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}