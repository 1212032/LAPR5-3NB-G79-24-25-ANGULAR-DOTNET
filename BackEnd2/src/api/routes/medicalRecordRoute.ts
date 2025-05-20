import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import auth from '../middlewares/auth';

import config from '../../../config';
import IMedicalRecordController from '../../controllers/IControllers/IMedicalRecordController';

const route = Router();

export default (app: Router) => {
    app.use('/medicalRecords', route);

    const ctrl = Container.get(config.controllers.medicalRecord.name) as IMedicalRecordController;

    route.get('', (req, res, next) => ctrl.getAllMedicalRecord(req, res, next));

    route.post('', auth.isDoctor,
        celebrate({
            body: Joi.object({
                patientId: Joi.string(),
                allergies: Joi.array().items({
                    allergyId: Joi.string(),
                    description: Joi.string()
                }),
                medicalConditions: Joi.array().items({
                    medicalConditionId: Joi.string(),
                    description: Joi.string()
                }),
                freeTexts: Joi.array().items(Joi.string())
            }),
        }),
        (req, res, next) => ctrl.createMedicalRecord(req, res, next));

    route.put('/:id', auth.isDoctor,
        celebrate({
            body: Joi.object({
                id: Joi.string(),
                patientId: Joi.string(),
                allergies: Joi.array().items({
                    allergyId: Joi.string(),
                    description: Joi.string()
                }),
                medicalConditions: Joi.array().items({
                    medicalConditionId: Joi.string(),
                    description: Joi.string()
                }),
                freeTexts: Joi.array().items(Joi.string())
            }),
        }),
        (req, res, next) => {
            let recordId: string = req.params.id;
            ctrl.updateMedicalRecord(recordId, req, res, next);
        });

    route.get('/:id', (req, res, next) => {
        let patientId: string = req.params.id;
        ctrl.getMedicalRecordByPatientId(patientId, req, res, next);
    });
};
