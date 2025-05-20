import * as sinon from 'sinon';

import { Response, Request, NextFunction } from 'express';

import config from '../../config';

import { Result } from '../core/logic/Result';

import { describe, it } from 'node:test';
import AllergyService from '../services/allergyService';
import IAllergyDTO from '../dto/IAllergyDTO';
import AllergyController from './allergyController';
import { Allergy } from '../domain/allergy';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import AllergyRepo from '../repos/allergyRepo';

describe('allergy controller', function () {
    beforeEach(function () { });

    it('on create allergy and return json with right values', async function () {
        let body = {
            code: 'ABC',
            name: 'name',
            description: 'description',
        };
        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            json: sinon.spy(),
        };
        let next: Partial<NextFunction> = () => { };

        let allergyServiceClass = require(config.services.allergy.path).default;

        let allergyService = new AllergyService(allergyServiceClass);

        sinon.stub(allergyService, 'createAllergy').returns(
            Result.ok<IAllergyDTO>({
                id: '123',
                code: req.body.code,
                name: req.body.name,
                description: req.body.description
            }),
        );
        const ctrl = new AllergyController(allergyService);

        await ctrl.createAllergy(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(
            res.json,
            sinon.match({
                id: '123',
                code: req.body.code,
                name: req.body.name,
                description: req.body.description
            }),
        );
    });
    it('should call service on create allergy', async function () {
        let body = {
            code: 'ABC',
            name: 'name',
            description: 'description'
        };
        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            json: sinon.spy(),
        };
        let next: Partial<NextFunction> = () => { };

        let allergyServiceClass = require(config.services.allergy.path).default;

        let allergyService = new AllergyService(allergyServiceClass);

        sinon.stub(allergyService, 'createAllergy').returns(
            Result.ok<IAllergyDTO>({
                id: '123',
                code: req.body.code,
                name: req.body.name,
                description: req.body.description,
            }),
        );
        const ctrl = new AllergyController(allergyService);

        await ctrl.createAllergy(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(allergyService.createAllergy);
        sinon.assert.calledWith(allergyService.createAllergy, req.body);
    });
    it('on create invalid allergy return fail error', async function () {
        const body = {
            name: 'name',
            description: 'description',
        };

        const req: Partial<Request> = { body };

        const res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy(),
        };

        const next: Partial<NextFunction> = sinon.spy();

        const allergyService = {
            createAllergy: sinon.stub().returns(
                Result.fail<IAllergyDTO>({
                    id: '123',
                    code: '',
                    name: req.body.name,
                    description: req.body.description,
                }),
            ),
        };

        const controller = new AllergyController(allergyService as AllergyService);

        await controller.createAllergy(req as Request, res as Response, next as NextFunction);
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status, 400);
    });


    it('on update allergy and return json with right values', async function () {
        let body = {
            code: 'ABC',
            name: 'name',
            description: 'description',
        };
        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            json: sinon.spy(),
        };
        let next: Partial<NextFunction> = () => { };

        let allergyServiceClass = require(config.services.allergy.path).default;
        let allergyService = new AllergyService(allergyServiceClass);

        sinon.stub(allergyService, 'updateAllergy').returns(
            Result.ok<IAllergyDTO>({
                id: '123',
                code: req.body.code,
                name: req.body.name,
                description: req.body.description
            }),
        );
        const ctrl = new AllergyController(allergyService);

        await ctrl.updateAllergy('123', <Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(
            res.json,
            sinon.match({
                id: '123',
                code: req.body.code,
                name: req.body.name,
                description: req.body.description
            }),
        );
    });
    it('should call service on update allergy', async function () {
        let body = {
            code: 'ABC',
            name: 'name',
            description: 'description'
        };
        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            json: sinon.spy(),
        };
        let next: Partial<NextFunction> = () => { };

        let allergyServiceClass = require(config.services.allergy.path).default;

        let allergyService = new AllergyService(allergyServiceClass);

        sinon.stub(allergyService, 'updateAllergy').returns(
            Result.ok<IAllergyDTO>({
                id: '123',
                code: req.body.code,
                name: req.body.name,
                description: req.body.description,
            }),
        );
        const ctrl = new AllergyController(allergyService);

        await ctrl.updateAllergy('123', <Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(allergyService.updateAllergy);
        sinon.assert.calledWith(allergyService.updateAllergy, '123', req.body);
    });
});

