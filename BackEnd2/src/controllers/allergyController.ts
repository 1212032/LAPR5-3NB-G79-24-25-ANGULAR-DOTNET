import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IAllergyController from "./IControllers/IAllergyController";
import IAllergyService from '../services/IServices/IAllergyService';
import IAllergyDTO from '../dto/IAllergyDTO';

import { Result } from "../core/logic/Result";

@Service()
export default class AllergyController implements IAllergyController {
    constructor(
        @Inject(config.services.allergy.name) private allergyServiceInstance: IAllergyService
    ) { }

    public async createAllergy(req: Request, res: Response, next: NextFunction) {
        try {
            const allergyOrError = await this.allergyServiceInstance.createAllergy(req.body as IAllergyDTO) as Result<IAllergyDTO>;

            if (allergyOrError.isFailure) {
                return res.status(400).json({ message: allergyOrError.error })
            }

            const allergyDTO = allergyOrError.getValue();
            return res.json(allergyDTO).status(201);
        }
        catch (e) {
            return next(e);
        }
    };

    public async updateAllergy(allergyId: string, req: Request, res: Response, next: NextFunction) {
        try {
            const allergyOrError = await this.allergyServiceInstance.updateAllergy(allergyId, req.body as IAllergyDTO) as Result<IAllergyDTO>;

            if (allergyOrError.isFailure) {
                return res.status(404).send();
            }

            const allergyDTO = allergyOrError.getValue();
            return res.json(allergyDTO).status(201);
        }
        catch (e) {
            return next(e);
        }
    };

    public async getAllAllergies(req: Request, res: Response, next: NextFunction) {
        try {
            let code: string = req.query.code == null ? '' : req.query.code.toString();
            let name: string = req.query.name == null ? '' : req.query.name.toString();
            const allergiesOrError = await this.allergyServiceInstance.getAllAllergies(code, name) as Result<IAllergyDTO[]>;

            if (allergiesOrError.isFailure) {
                return res.status(404).send();
            }

            const allergiesDTO = allergiesOrError.getValue();
            return res.status(200).json(allergiesDTO);
        } catch (e) {
            return next(e);
        }
    }

    public async getAllergy(allergyId: string, req: Request, res: Response, next: NextFunction) {
        try {
            const allergyOrError = await this.allergyServiceInstance.getAllergy(allergyId) as Result<IAllergyDTO>;

            if (allergyOrError.isFailure) {
                return res.status(404).send();
            }

            const allergyDTO = allergyOrError.getValue();
            return res.status(200).json(allergyDTO);
        } catch (e) {
            return next(e);
        }
    }
}