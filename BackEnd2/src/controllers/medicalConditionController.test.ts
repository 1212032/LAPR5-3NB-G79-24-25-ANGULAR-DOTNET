import * as sinon from 'sinon';

import { Response, Request, NextFunction } from 'express';

import { Container } from 'typedi';
import config from '../../config';

import { Result } from '../core/logic/Result';

import { describe, it } from 'node:test';
import MedicalConditionService from '../services/medicalConditionService';
import { IMedicalConditionDTO } from '../dto/IMedicalConditionDTO';
import MedicalConditionController from './medicalConditionController';

describe('medical condition controller', function() {
  beforeEach(function() {});

  it('on create medical condition and return json with right values', async function() {
    let body = {
      code: 'ABC',
      name: 'Symptom',
      description: 'description',
      symptoms: [],
    };
    let req: Partial<Request> = {};
    req.body = body;

    let res: Partial<Response> = {
      json: sinon.spy(),
    };
    let next: Partial<NextFunction> = () => {};

    let medicalConditionServiceClass = require(config.services.medicalCondition.path).default;

    let medicalConditionService = new MedicalConditionService(medicalConditionServiceClass);

    sinon.stub(medicalConditionService, 'createMedicalCondition').returns(
      Result.ok<IMedicalConditionDTO>({
        id: '123',
        code: req.body.code,
        name: req.body.name,
        description: req.body.description,
        symptoms: [],
      }),
    );
    const ctrl = new MedicalConditionController(medicalConditionService);

    await ctrl.createMedicalCondition(<Request>req, <Response>res, <NextFunction>next);

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(
      res.json,
      sinon.match({
        id: '123',
        code: req.body.code,
        name: req.body.name,
        description: req.body.description,
        symptoms: [],
      }),
    );
  });
  it('should call service on create medical condition', async function() {
    let body = {
      code: 'ABC',
      name: 'Symptom',
      description: 'description',
      symptoms: [],
    };
    let req: Partial<Request> = {};
    req.body = body;

    let res: Partial<Response> = {
      json: sinon.spy(),
    };
    let next: Partial<NextFunction> = () => {};

    let medicalConditionServiceClass = require(config.services.medicalCondition.path).default;

    let medicalConditionService = new MedicalConditionService(medicalConditionServiceClass);

    sinon.stub(medicalConditionService, 'createMedicalCondition').returns(
      Result.ok<IMedicalConditionDTO>({
        id: '123',
        code: req.body.code,
        name: req.body.name,
        description: req.body.description,
        symptoms: [],
      }),
    );
    const ctrl = new MedicalConditionController(medicalConditionService);

    await ctrl.createMedicalCondition(<Request>req, <Response>res, <NextFunction>next);

    sinon.assert.calledOnce(medicalConditionService.createMedicalCondition);
    sinon.assert.calledWith(medicalConditionService.createMedicalCondition, req.body);
  });
  it('on create invalid medical condition return fail error', async function() {
    const body = {
      name: 'Symptom',
      description: 'description',
      symptoms: [],
    };

    const req: Partial<Request> = { body };

    const res: Partial<Response> = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
    };

    const next: Partial<NextFunction> = sinon.spy();

    const medicalConditionService = {
      createMedicalCondition: sinon.stub().returns(
        Result.fail<IMedicalConditionDTO>({
          id: '123',
          code: '',
          name: req.body.name,
          description: req.body.description,
          symptoms: [],
        }),
      ),
    };

    const controller = new MedicalConditionController(medicalConditionService  as MedicalConditionService);

    await controller.createMedicalCondition(req as Request, res as Response, next as NextFunction);
    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status, 402);
    sinon.assert.calledOnce(res.send);
  });
});

