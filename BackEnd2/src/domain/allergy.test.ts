import * as sinon from 'sinon';
import { Result } from '../core/logic/Result';
import { describe, it } from 'node:test';
import IAllergyDTO from '../dto/IAllergyDTO';
import { Allergy } from './allergy';

describe('allergy', function () {
    beforeEach(function () { });
    it('on create allergy and return json with right values', async function () {
        let dto = {
            id: '123',
            code: 'ABC',
            name: 'Symptom',
            description: 'description'
        };
        let returnAllergy = {
            code: 'ABC',
            name: 'Symptom',
            description: 'description'
        }
        const createStub = sinon.stub(Allergy, 'create').returns(Result.ok<Allergy>(returnAllergy as Allergy));
        const result = Allergy.create(dto as IAllergyDTO);

        sinon.assert.calledOnce(createStub);
        sinon.assert.calledWith(createStub, dto);

        sinon.assert.match(result.isSuccess, true);

        const allergy = result.getValue();

        sinon.assert.match(allergy, returnAllergy);

        createStub.restore();
    });
    it('on create invalid allergy code return fail error', () => {
        const dto = {
            id: '123',
            name: 'Symptom',
            description: 'description'
        };

        const result = Allergy.create(dto as IAllergyDTO);

        sinon.assert.match(result.isFailure, true);
        sinon.assert.match(result.errorValue(), 'Must provide an allergy code');
    });
    it('on create invalid allergy name return fail error', () => {
        const dto = {
            id: '123',
            code: 'ABC',
            description: 'description'
        };

        const result = Allergy.create(dto as IAllergyDTO);

        sinon.assert.match(result.isFailure, true);
        sinon.assert.match(result.errorValue(), 'Must provide an allergy name');
    });
    it('on create invalid allergy description return fail error', () => {
        const dto = {
            id: '123',
            code: 'ABC',
            name: 'Symptom'
        };

        const result = Allergy.create(dto as IAllergyDTO);

        sinon.assert.match(result.isFailure, true);
        sinon.assert.match(result.errorValue(), 'Must provide an allergy description');
    });
});
