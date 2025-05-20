import * as sinon from 'sinon';
import { Result } from '../core/logic/Result';
import { describe, it } from 'node:test';
import { IMedicalConditionDTO } from '../dto/IMedicalConditionDTO';
import { MedicalCondition } from './medicalCondition';

describe('medical condition', function() {
  beforeEach(function() {});
  it('on create medical condition and return json with right values', async function() {
    let dto = {
      id: '123',
      code: 'ABC',
      name: 'Symptom',
      description: 'description',
      symptoms: ['Headache', 'Fever'],
    };
    let returnMedicalCondition={
      code: 'ABC',
      name: 'Symptom',
      description: 'description',
      symptoms:['Headache', 'Fever'],
    }
    const createStub = sinon.stub(MedicalCondition, 'create').returns(Result.ok<MedicalCondition>(returnMedicalCondition as MedicalCondition));
    const result = MedicalCondition.create(dto as IMedicalConditionDTO);

    sinon.assert.calledOnce(createStub);
    sinon.assert.calledWith(createStub, dto);

    sinon.assert.match(result.isSuccess, true);

    const medicalCondition = result.getValue();

    sinon.assert.match(medicalCondition, returnMedicalCondition);

    createStub.restore();
  });
  it('on create invalid medical condition code return fail error', () => {
    const dto = {
      id: '123',
      name: 'Symptom',
      description: 'description',
      symptoms: [],
    };

    const result = MedicalCondition.create(dto as IMedicalConditionDTO);

    sinon.assert.match(result.isFailure, true);
    sinon.assert.match(result.errorValue(), 'Must provide a medical condition code');
  });
  it('on create invalid medical condition name return fail error', () => {
    const dto = {
      id: '123',
      code: 'ABC',
      description: 'description',
      symptoms: [],
    };

    const result = MedicalCondition.create(dto as IMedicalConditionDTO);

    sinon.assert.match(result.isFailure, true);
    sinon.assert.match(result.errorValue(), 'Must provide a medical condition name');
  });
  it('on create invalid medical condition description return fail error', () => {
    const dto = {
      id: '123',
      code: 'ABC',
      name: 'Symptom',
      symptoms: [],
    };

    const result = MedicalCondition.create(dto as IMedicalConditionDTO);

    sinon.assert.match(result.isFailure, true);
    sinon.assert.match(result.errorValue(), 'Must provide a medical condition description');
  });
});
