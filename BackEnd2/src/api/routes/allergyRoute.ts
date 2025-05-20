import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IAllergyController from '../../controllers/IControllers/IAllergyController';

import config from "../../../config";
import auth from '../middlewares/auth';

const route = Router();

export default (app: Router) => {
    app.use('/allergies', route);

    const ctrl = Container.get(config.controllers.allergy.name) as IAllergyController;

    route.get('', /*auth.isAdminOrDoctor,*/ (req, res, next) => ctrl.getAllAllergies(req, res, next));

    route.get('/:id', auth.isAdminOrDoctor, (req, res, next) => {
        let allergyId: string = req.params.id;
        ctrl.getAllergy(allergyId, req, res, next);
    });

    route.post('', auth.isAdmin,
        celebrate({
            body: Joi.object({
                code: Joi.string().required(),
                name: Joi.string().required(),
                description: Joi.string()
            })
        }),
        (req, res, next) => ctrl.createAllergy(req, res, next));

    route.put('/:id', auth.isAdmin,
        celebrate({
            body: Joi.object({
                id: Joi.string(),
                code: Joi.string().required(),
                name: Joi.string().required(),
                description: Joi.string()
            }),
        }),
        (req, res, next) => {
            let allergyId: string = req.params.id;
            ctrl.updateAllergy(allergyId, req, res, next)
        });
};