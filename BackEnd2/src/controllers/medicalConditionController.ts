import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";


import { Result } from "../core/logic/Result";
import IMedicalConditionController from './IControllers/IMedicalConditionController';
import IMedicalConditionService from '../services/IServices/IMedicalConditionService';
import { IMedicalConditionDTO } from '../dto/IMedicalConditionDTO';

@Service()
export default class MedicalConditionController implements IMedicalConditionController {
    constructor(
        @Inject(config.services.medicalCondition.name) private medicalConditionServiceInstance: IMedicalConditionService
    ) { }

    public async createMedicalCondition(req: Request, res: Response, next: NextFunction) {
        try {
            const medicalConditionOrError = await this.medicalConditionServiceInstance.createMedicalCondition(req.body as IMedicalConditionDTO) as Result<IMedicalConditionDTO>;
            if (medicalConditionOrError.isFailure) {
                return res.status(402).send();
            }

            const medicalConditionDTO = medicalConditionOrError.getValue();
            return res.json(medicalConditionDTO).status(201);
        }
        catch (e) {
            return next(e);
        }
    };

    public async getAllMedicalConditions(req: Request, res: Response, next: NextFunction) {
        try {
            let code: string = req.query.code == null ? '' : req.query.code.toString();
            let name: string = req.query.name == null ? '' : req.query.name.toString();
            const medicalConditionsOrError = await this.medicalConditionServiceInstance.getAllMedicalConditions(code, name) as Result<IMedicalConditionDTO[]>;

            if (medicalConditionsOrError.isFailure) {
                return res.status(404).send();
            }

            const medicalConditionsDTO = medicalConditionsOrError.getValue();
            return res.status(200).json(medicalConditionsDTO);
        } catch (e) {
            return next(e);
        }
    }

    public async updateMedicalCondition(medicalConditionId: string, req: Request, res: Response, next: NextFunction) {
        try {
            const medicalConditionOrError = await this.medicalConditionServiceInstance.updateMedicalCondition(medicalConditionId, req.body as IMedicalConditionDTO) as Result<IMedicalConditionDTO>;

            if (medicalConditionOrError.isFailure) {
                return res.status(404).send();
            }

            const medicalConditionDTO = medicalConditionOrError.getValue();
            return res.status(201).json(medicalConditionDTO);
        }
        catch (e) {
            return next(e);
        }
    };

    public async getMedicalCondition(conditionId: string, req: Request, res: Response, next: NextFunction) {
        try {
            const medicalConditionOrError = await this.medicalConditionServiceInstance.getMedicalCondition(conditionId) as Result<IMedicalConditionDTO>;

            if (medicalConditionOrError.isFailure) {
                return res.status(404).send();
            }

            const medicalConditionDTO = medicalConditionOrError.getValue();
            return res.status(200).json(medicalConditionDTO);
        } catch (e) {
            return next(e);
        }
    }
}