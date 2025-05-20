import * as sinon from 'sinon';

import { Response, Request, NextFunction } from 'express';

import { Container } from 'typedi';
import config from '../../config';

import { Result } from '../core/logic/Result';

import { describe, it } from 'node:test';
import MedicalConditionService from './medicalConditionService';
import { IMedicalConditionDTO } from '../dto/IMedicalConditionDTO';

describe('medical condition service', function() {
  beforeEach(function() {});

  it('on create medical condition and return json with right values', async function() {
    let dto = {
      id: '123',
      code: 'ABC',
      name: 'Symptom',
      description: 'description',
      symptoms: [],
    };
    let medicalConditionServiceClass = require(config.services.medicalCondition.path).default;

    let medicalConditionService = new MedicalConditionService(medicalConditionServiceClass);

    sinon.stub(medicalConditionService, 'createMedicalCondition').returns(Result.ok<IMedicalConditionDTO>(dto));

    await medicalConditionService.createMedicalCondition(dto as IMedicalConditionDTO);

    sinon.assert.calledOnce(medicalConditionService.createMedicalCondition);
    sinon.assert.calledWith(medicalConditionService.createMedicalCondition,{
        id: '123',
        code: 'ABC',
        name: 'Symptom',
        description: 'description',
        symptoms: [],
      }
    );
  });
  it('should call service on create medical condition', async function() {
    let dto = {
      id: '123',
      code: 'ABC',
      name: 'Symptom',
      description: 'description',
      symptoms: [],
    };

    let medicalConditionServiceClass = require(config.services.medicalCondition.path).default;

    let medicalConditionService = new MedicalConditionService(medicalConditionServiceClass);

    sinon.stub(medicalConditionService, 'createMedicalCondition').returns(Result.ok<IMedicalConditionDTO>(dto));

    await medicalConditionService.createMedicalCondition(dto as IMedicalConditionDTO);

    sinon.assert.calledOnce(medicalConditionService.createMedicalCondition);
    sinon.assert.calledWith(medicalConditionService.createMedicalCondition, dto);
  });
  it('on create invalid medical condition code return fail error', async function() {
    const dto = {
      id: '123',
      name: 'Symptom',
      description: 'description',
      symptoms: [],
    };


    let medicalConditionServiceClass = require(config.services.medicalCondition.path).default;

    let medicalConditionService = new MedicalConditionService(medicalConditionServiceClass);

    const result = await medicalConditionService.createMedicalCondition(dto as IMedicalConditionDTO);

    sinon.assert.match(result.isFailure, true);
    sinon.assert.match(result.errorValue(), 'Must provide a medical condition code');

  });
  it('on create invalid medical condition name return fail error', async function() {
    const dto = {
      id: '123',
      code:'ABC',
      description: 'description',
      symptoms: [],
    };


    let medicalConditionServiceClass = require(config.services.medicalCondition.path).default;

    let medicalConditionService = new MedicalConditionService(medicalConditionServiceClass);

    // Act: Call the service method
    const result = await medicalConditionService.createMedicalCondition(dto as IMedicalConditionDTO);

    sinon.assert.match(result.isFailure, true);
    sinon.assert.match(result.errorValue(), 'Must provide a medical condition name');

  });
  it('on create invalid medical condition description return fail error', async function() {
    const dto = {
      id: '123',
      code:'ABC',
      name:'Symptom',
      symptoms: [],
    };


    let medicalConditionServiceClass = require(config.services.medicalCondition.path).default;

    let medicalConditionService = new MedicalConditionService(medicalConditionServiceClass);

    const result = await medicalConditionService.createMedicalCondition(dto as IMedicalConditionDTO);

    sinon.assert.match(result.isFailure, true);
    sinon.assert.match(result.errorValue(), 'Must provide a medical condition description');

  });
});
