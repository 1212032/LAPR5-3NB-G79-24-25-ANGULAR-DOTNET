import * as sinon from 'sinon';
import { describe, it } from 'node:test';
import { Container } from 'typedi';
import { Response, Request, NextFunction } from 'express';
import MedicalRecordService from './medicalRecordService';
import { MedicalRecord } from '../domain/medicalRecord';
import { Result } from '../core/logic/Result';
import { MedicalRecordMap } from '../mappers/MedicalRecordMap';
import IMedicalRecordRepo from '../repos/IRepos/IMedicalRecordRepo';
import IMedicalRecordDTO from '../dto/IMedicalRecordDTO';
import config from '../../config';

describe('medical record service', function() {
  beforeEach(function() {});

  it('on get medical record returns medical record', async function() {
    const dto: IMedicalRecordDTO = {
      id: '123',
      patientId: '1',
      allergies: [],
      medicalConditions: [],
      freeTexts: [],
    };
    
    let medicalRecordServiceClass = require(config.services.medicalRecord.path).default;
    let medicalRecordService = new MedicalRecordService(medicalRecordServiceClass);

    sinon.stub(medicalRecordService, 'getMedicalRecord').returns(Result.ok<IMedicalRecordDTO>(dto));

    const result = await medicalRecordService.getMedicalRecord('123');

    sinon.assert.match(result.isSuccess, true);
    sinon.assert.match(result.getValue(), dto);
  });

  it('on get medical record not found returns 404', async function() {
    let medicalRecordServiceClass = require(config.services.medicalRecord.path).default;
    let medicalRecordService = new MedicalRecordService(medicalRecordServiceClass);

    sinon.stub(medicalRecordService, 'getMedicalRecord').returns(Result.fail<IMedicalRecordDTO>('Medical record not found'));

    const result = await medicalRecordService.getMedicalRecord('123');

    sinon.assert.match(result.isFailure, true);
    sinon.assert.match(result.errorValue(), 'Medical record not found');
  });

  it('on update medical record returns updated record', async function() {
    const dto: IMedicalRecordDTO = {
      id: '123',
      patientId: '1',
      allergies: [],
      medicalConditions: [],
      freeTexts: [],
    };

    let medicalRecordServiceClass = require(config.services.medicalRecord.path).default;
    let medicalRecordService = new MedicalRecordService(medicalRecordServiceClass);

    sinon.stub(medicalRecordService, 'updateMedicalRecord').returns(Result.ok<IMedicalRecordDTO>(dto));

    const result = await medicalRecordService.updateMedicalRecord('123', dto);

    sinon.assert.match(result.isSuccess, true);
    sinon.assert.match(result.getValue(), dto);
  });
});
