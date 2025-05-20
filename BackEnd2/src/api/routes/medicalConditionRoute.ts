import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import auth from '../middlewares/auth';

import config from "../../../config";
import IMedicalConditionController from '../../controllers/IControllers/IMedicalConditionController';

const route = Router();

export default (app: Router) => {
    app.use('/medicalConditions', route);

    const ctrl = Container.get(config.controllers.medicalCondition.name) as IMedicalConditionController;

    route.get('', /*auth.isAdminOrDoctor,*/ (req, res, next) => ctrl.getAllMedicalConditions(req, res, next));

    route.get('/:id', auth.isAdminOrDoctor, (req, res, next) => {
        let conditionId: string = req.params.id;
        ctrl.getMedicalCondition(conditionId, req, res, next);
    });

    route.post('', auth.isAdmin,
        celebrate({
            body: Joi.object({
                code: Joi.string().required(),
                name: Joi.string().required(),
                description: Joi.string().required(),
                symptoms: Joi.array().items(Joi.string())
            })
        }),
        (req, res, next) => ctrl.createMedicalCondition(req, res, next));

    route.put('/:id', auth.isAdmin,
        celebrate({
            body: Joi.object({
                id: Joi.string(),
                code: Joi.string().required(),
                name: Joi.string().required(),
                description: Joi.string().required(),
                symptoms: Joi.array().items(Joi.string())
            }),
        }),
        (req, res, next) => {
            let medicalConditionId: string = req.params.id;
            ctrl.updateMedicalCondition(medicalConditionId, req, res, next)
        });
};