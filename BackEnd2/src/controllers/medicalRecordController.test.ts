import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { describe, it } from 'node:test';
import { Result } from '../core/logic/Result';
import MedicalRecordService from '../services/medicalRecordService';
import MedicalRecordController from './medicalRecordController';
import { IMedicalRecordAllergyDTO } from '../dto/IMedicalRecordAllergyDTO';
import { IMedicalRecordConditionDTO } from '../dto/IMedicalRecordConditionDTO';
import config from '../../config';
import IMedicalRecordDTO from '../dto/IMedicalRecordDTO';

describe('medical record controller', function() {
  beforeEach(function() {}); // You can add any setup you need here

  it('on create medical record and return json with right values', async function() {
    const body = {
      id: '123',
      patientId: '1',
      allergies: [{ allergyId: '1', description: 'Peanuts' } as IMedicalRecordAllergyDTO],
      medicalConditions: [{ medicalConditionId: '101', description: 'Asthma' } as IMedicalRecordConditionDTO],
      freeTexts: ['Patient has a mild case of asthma.'] as string[],
    };

    const req: Partial<Request> = { body };
    const res: Partial<Response> = { json: sinon.spy() };
    const next: Partial<NextFunction> = () => {};

    const medicalRecordServiceClass = require(config.services.medicalRecord.path).default;
    const medicalRecordService = new MedicalRecordService(medicalRecordServiceClass);

    sinon.stub(medicalRecordService, 'createMedicalRecord').returns(
      Result.ok<IMedicalRecordDTO>({
        id: body.id,
        patientId: body.patientId,
        allergies: body.allergies,
        medicalConditions: body.medicalConditions,
        freeTexts: body.freeTexts,
      }),
    );

    const controller = new MedicalRecordController(medicalRecordService);

    await controller.createMedicalRecord(<Request>req, <Response>res, <NextFunction>next);

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(
      res.json,
      sinon.match({
        id: body.id,
        allergies: body.allergies,
        medicalConditions: body.medicalConditions,
        freeTexts: body.freeTexts,
      }),
    );
  });

  it('should call service on create medical record', async function() {
    const body = {
      id: '123',
      patientId: '1',
      allergies: [{ allergyId: '1', description: 'Peanuts' } as IMedicalRecordAllergyDTO],
      medicalConditions: [{ medicalConditionId: '101', description: 'Asthma' } as IMedicalRecordConditionDTO],
      freeTexts: ['Patient has a mild case of asthma.'] as string[],
    };

    const req: Partial<Request> = { body };
    const res: Partial<Response> = { json: sinon.spy() };
    const next: Partial<NextFunction> = () => {};

    const medicalRecordServiceClass = require(config.services.medicalRecord.path).default;
    const medicalRecordService = new MedicalRecordService(medicalRecordServiceClass);

    sinon.stub(medicalRecordService, 'createMedicalRecord').returns(
      Result.ok<IMedicalRecordDTO>({
        id: body.id,
        patientId: body.patientId,
        allergies: body.allergies,
        medicalConditions: body.medicalConditions,
        freeTexts: body.freeTexts,
      }),
    );

    const controller = new MedicalRecordController(medicalRecordService);

    await controller.createMedicalRecord(<Request>req, <Response>res, <NextFunction>next);

    sinon.assert.calledOnce(medicalRecordService.createMedicalRecord);
    sinon.assert.calledWith(medicalRecordService.createMedicalRecord, body);
  });

  it('on create invalid medical record return fail error', async function() {
    const body = {
      allergies: [{ allergyId: '1', description: 'Peanuts' } as IMedicalRecordAllergyDTO],
      medicalConditions: [{ medicalConditionId: '101', description: 'Asthma' } as IMedicalRecordConditionDTO],
      freeTexts: ['Patient has a mild case of asthma.'] as string[],
    };

    const req: Partial<Request> = { body };

    const res: Partial<Response> = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
    };

    const next: Partial<NextFunction> = sinon.spy();

    const medicalRecordService = {
      createMedicalRecord: sinon.stub().returns(
        Result.fail<IMedicalRecordDTO>({
          id: '',
          patientId: '1',
          allergies: req.body.allergies,
          medicalConditions: req.body.medicalConditions,
          freeTexts: req.body.freeTexts,
        }),
      ),
    };

    const controller = new MedicalRecordController(medicalRecordService as any);

    await controller.createMedicalRecord(req as Request, res as Response, next as NextFunction);

    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status, 402);
    sinon.assert.calledOnce(res.send);
  });

  it('on get medical record returns record', async function() {
    const req: Partial<Request> = { params: { recordId: '123' } };
    const res: Partial<Response> = { json: sinon.spy(), status: sinon.stub().returnsThis() }; // Ensure status is mocked to chain with json
    const next: Partial<NextFunction> = sinon.spy();

    const medicalRecordServiceClass = require(config.services.medicalRecord.path).default;
    const medicalRecordService = new MedicalRecordService(medicalRecordServiceClass);

    sinon.stub(medicalRecordService, 'getMedicalRecord').returns(
      Result.ok<IMedicalRecordDTO>({
        id: '123',
        patientId: '1',
        allergies: [{ allergyId: '1', description: 'Peanuts' }] as IMedicalRecordAllergyDTO[],
        medicalConditions: [{ medicalConditionId: '101', description: 'Asthma' }] as IMedicalRecordConditionDTO[],
        freeTexts: ['Patient has a mild case of asthma.'],
      }),
    );

    const controller = new MedicalRecordController(medicalRecordService);
    await controller.getMedicalRecord('123', <Request>req, <Response>res, <NextFunction>next);

    sinon.assert.calledOnce(res.json);

    sinon.assert.calledWith(
      res.json,
      sinon.match({
        id: '123',
        patientId: '1',
        allergies: [{ allergyId: '1', description: 'Peanuts' }],
        medicalConditions: [{ medicalConditionId: '101', description: 'Asthma' }],
        freeTexts: ['Patient has a mild case of asthma.'],
      }),
    );
  });

  it('on get medical record not found returns 404', async function() {
    const req: Partial<Request> = { params: { recordId: '123' } };
    const res: Partial<Response> = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
    };
    const next: Partial<NextFunction> = sinon.spy();

    const medicalRecordServiceClass = require(config.services.medicalRecord.path).default;
    const medicalRecordService = new MedicalRecordService(medicalRecordServiceClass);

    sinon.stub(medicalRecordService, 'getMedicalRecord').returns(Result.fail<IMedicalRecordDTO>({}));

    const controller = new MedicalRecordController(medicalRecordService);

    await controller.getMedicalRecord('123', <Request>req, <Response>res, <NextFunction>next);

    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledOnce(res.send);
  });

  it('on get all medical records returns records', async function() {
    const req: Partial<Request> = {}; 
    const res: Partial<Response> = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    const next: Partial<NextFunction> = sinon.spy(); 

    const medicalRecordServiceClass = require(config.services.medicalRecord.path).default;
    const medicalRecordService = new MedicalRecordService(medicalRecordServiceClass);

    sinon.stub(medicalRecordService, 'getAllMedicalRecords').returns(
      Result.ok<IMedicalRecordDTO[]>([{ id: '123', patientId: '1', allergies: [], medicalConditions: [], freeTexts: [] }]),
    );

    const controller = new MedicalRecordController(medicalRecordService);
    await controller.getAllMedicalRecord(<Request>req, <Response>res, <NextFunction>next);

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match.array);
  });

  it('on get all medical records returns 404 when not found', async function() {
    const req: Partial<Request> = {};
    const res: Partial<Response> = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
    };
    const next: Partial<NextFunction> = sinon.spy();

    const medicalRecordServiceClass = require(config.services.medicalRecord.path).default;
    const medicalRecordService = new MedicalRecordService(medicalRecordServiceClass);

    sinon.stub(medicalRecordService, 'getAllMedicalRecords').returns(Result.fail<IMedicalRecordDTO[]>([]));

    const controller = new MedicalRecordController(medicalRecordService);

    await controller.getAllMedicalRecord(<Request>req, <Response>res, <NextFunction>next);

    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledOnce(res.send);
  });

  it('on update medical record returns updated record', async function() {
    const body = {
      id: '123',
      patientId: '1',
      allergies: [{ allergyId: '1', description: 'Peanuts' } as IMedicalRecordAllergyDTO],
      medicalConditions: [{ medicalConditionId: '101', description: 'Asthma' } as IMedicalRecordConditionDTO],
      freeTexts: ['Patient has a mild case of asthma.'] as string[],
    };

    const req: Partial<Request> = { params: { recordId: '123' }, body };
    const res: Partial<Response> = { json: sinon.spy(), status: sinon.stub().returnsThis() }; 
    const next: Partial<NextFunction> = sinon.spy(); 

    const medicalRecordServiceClass = require(config.services.medicalRecord.path).default;
    const medicalRecordService = new MedicalRecordService(medicalRecordServiceClass);

    sinon.stub(medicalRecordService, 'updateMedicalRecord').returns(
      Result.ok<IMedicalRecordDTO>({
        id: body.id,
        patientId: body.patientId,
        allergies: body.allergies,
        medicalConditions: body.medicalConditions,
        freeTexts: body.freeTexts,
      }),
    );

    const controller = new MedicalRecordController(medicalRecordService);

    await controller.updateMedicalRecord('123', <Request>req, <Response>res, <NextFunction>next);

    sinon.assert.calledOnce(res.json);

    sinon.assert.calledWith(
      res.json,
      sinon.match({
        id: body.id,
        patientId: body.patientId,
        allergies: body.allergies,
        medicalConditions: body.medicalConditions,
        freeTexts: body.freeTexts,
      }),
    );

    sinon.assert.notCalled(next);
  });
});
