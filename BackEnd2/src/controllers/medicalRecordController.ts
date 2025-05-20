import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import { Result } from "../core/logic/Result";
import IMedicalRecordController from './IControllers/IMedicalRecordController';
import IMedicalRecordService from '../services/IServices/IMedicalRecordService';
import IMedicalRecordDTO from '../dto/IMedicalRecordDTO';

@Service()
export default class MedicalRecordController implements IMedicalRecordController {
    constructor(
        @Inject(config.services.medicalRecord.name) private medicalRecordServiceInstance: IMedicalRecordService
    ) { }
    
    public async createMedicalRecord(req: Request, res: Response, next: NextFunction) {
        try {
            const medicalRecordOrError = await this.medicalRecordServiceInstance.createMedicalRecord(req.body as IMedicalRecordDTO) as Result<IMedicalRecordDTO>;
            if (medicalRecordOrError.isFailure) {
                return res.status(402).send();
            }

            const medicalRecordDTO = medicalRecordOrError.getValue();
            return res.json(medicalRecordDTO).status(201);
        }
        catch (e) {
            return next(e);
        }
    };

    public async getMedicalRecord(recordId: string, req: Request, res: Response, next: NextFunction) {
        try {
            const medicalRecordOrError = await this.medicalRecordServiceInstance.getMedicalRecord(recordId) as Result<IMedicalRecordDTO>;

            if (medicalRecordOrError.isFailure) {
                return res.status(404).send();
            }

            const medicalRecordDTO = medicalRecordOrError.getValue();
            return res.status(200).json(medicalRecordDTO);
        } catch (e) {
            return next(e);
        }
    }
    public async getMedicalRecordByPatientId(patientId: string, req: Request, res: Response, next: NextFunction) {
        try {
            const medicalRecordOrError = await this.medicalRecordServiceInstance.getMedicalRecordByPatientId(patientId) as Result<IMedicalRecordDTO>;

            if (medicalRecordOrError.isFailure) {
                return res.status(404).send();
            }

            const medicalRecordDTO = medicalRecordOrError.getValue();
            return res.status(200).json(medicalRecordDTO);
        } catch (e) {
            return next(e);
        }
    }

    public async getAllMedicalRecord(req: Request, res: Response, next: NextFunction) {
        try {
            const medicalRecordOrError = await this.medicalRecordServiceInstance.getAllMedicalRecords() as Result<IMedicalRecordDTO[]>;

            if (medicalRecordOrError.isFailure) {
                return res.status(404).send();
            }

            const medicalRecordDTO = medicalRecordOrError.getValue();
            return res.status(200).json(medicalRecordDTO);
        } catch (e) {
            return next(e);
        }
    }

    public async updateMedicalRecord(patientId: string, req: Request, res: Response, next: NextFunction) {
        try {
            const medicalRecordOrError = await this.medicalRecordServiceInstance.updateMedicalRecord(patientId, req.body as IMedicalRecordDTO) as Result<IMedicalRecordDTO>;

            if (medicalRecordOrError.isFailure) {
                return res.status(404).send();
            }

            const medicalRecordDTO = medicalRecordOrError.getValue();
            return res.status(201).json(medicalRecordDTO);
        }
        catch (e) {
            return next(e);
        }
    };
}