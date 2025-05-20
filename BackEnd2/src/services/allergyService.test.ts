import * as sinon from 'sinon';

import { Response, Request, NextFunction } from 'express';

import { Container } from 'typedi';
import config from '../../config';

import { Result } from '../core/logic/Result';

import { describe, it } from 'node:test';
import AllergyService from './allergyService';
import IAllergyDTO from '../dto/IAllergyDTO';

describe('allergy service', function () {
    beforeEach(function () { });

    it('on create allergy and return json with right values', async function () {
        let dto = {
            id: '123',
            code: 'ABC',
            name: 'Symptom',
            description: 'description',
        };
        let allergyServiceClass = require(config.services.allergy.path).default;

        let allergyService = new AllergyService(allergyServiceClass);

        sinon.stub(allergyService, 'createAllergy').returns(Result.ok<IAllergyDTO>(dto));

        await allergyService.createAllergy(dto as IAllergyDTO);

        sinon.assert.calledOnce(allergyService.createAllergy);
        sinon.assert.calledWith(allergyService.createAllergy, {
            id: '123',
            code: 'ABC',
            name: 'Symptom',
            description: 'description',
        }
        );
    });
    it('should call service on create allergy', async function () {
        let dto = {
            id: '123',
            code: 'ABC',
            name: 'Symptom',
            description: 'description',
        };

        let allergyServiceClass = require(config.services.allergy.path).default;

        let allergyService = new AllergyService(allergyServiceClass);

        sinon.stub(allergyService, 'createAllergy').returns(Result.ok<IAllergyDTO>(dto));

        await allergyService.createAllergy(dto as IAllergyDTO);

        sinon.assert.calledOnce(allergyService.createAllergy);
        sinon.assert.calledWith(allergyService.createAllergy, dto);
    });
    it('on create invalid allergy code return fail error', async function () {
        const dto = {
            id: '123',
            name: 'Symptom',
            description: 'description'
        };


        let allergyServiceClass = require(config.services.allergy.path).default;

        let allergyService = new AllergyService(allergyServiceClass);

        const result = await allergyService.createAllergy(dto as IAllergyDTO);

        sinon.assert.match(result.isFailure, true);
        sinon.assert.match(result.errorValue(), 'Must provide an allergy code');

    });
    it('on create invalid allergy name return fail error', async function () {
        const dto = {
            id: '123',
            code: 'ABC',
            description: 'description'
        };


        let allergyServiceClass = require(config.services.allergy.path).default;

        let allergyService = new AllergyService(allergyServiceClass);

        // Act: Call the service method
        const result = await allergyService.createAllergy(dto as IAllergyDTO);

        sinon.assert.match(result.isFailure, true);
        sinon.assert.match(result.errorValue(), 'Must provide an allergy name');

    });
    it('on create invalid allergy description return fail error', async function () {
        const dto = {
            id: '123',
            code: 'ABC',
            name: 'Symptom'
        };


        let allergyServiceClass = require(config.services.allergy.path).default;

        let allergyService = new AllergyService(allergyServiceClass);

        const result = await allergyService.createAllergy(dto as IAllergyDTO);

        sinon.assert.match(result.isFailure, true);
        sinon.assert.match(result.errorValue(), 'Must provide an allergy description');

    });


    it('on update allergy and return json with right values', async function () {
        let dto = {
            id: '123',
            code: 'ABC',
            name: 'Symptom',
            description: 'description',
        };
        let allergyServiceClass = require(config.services.allergy.path).default;

        let allergyService = new AllergyService(allergyServiceClass);

        sinon.stub(allergyService, 'updateAllergy').returns(Result.ok<IAllergyDTO>(dto));

        await allergyService.updateAllergy('123', dto as IAllergyDTO);

        sinon.assert.calledOnce(allergyService.updateAllergy);
        sinon.assert.calledWith(allergyService.updateAllergy, '123', {
            id: '123',
            code: 'ABC',
            name: 'Symptom',
            description: 'description',
        }
        );
    });
    it('should call service on update allergy', async function () {
        let dto = {
            id: '123',
            code: 'ABC',
            name: 'Symptom',
            description: 'description',
        };

        let allergyServiceClass = require(config.services.allergy.path).default;

        let allergyService = new AllergyService(allergyServiceClass);

        sinon.stub(allergyService, 'updateAllergy').returns(Result.ok<IAllergyDTO>(dto));

        await allergyService.updateAllergy('123', dto as IAllergyDTO);

        sinon.assert.calledOnce(allergyService.updateAllergy);
        sinon.assert.calledWith(allergyService.updateAllergy, '123', dto);
    });
});
