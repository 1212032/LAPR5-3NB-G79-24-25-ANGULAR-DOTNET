import * as sinon from 'sinon';
import { describe, it } from 'node:test';
import IMedicalRecordDTO from '../dto/IMedicalRecordDTO';
import { MedicalRecord } from './medicalRecord';
import { IMedicalRecordAllergyDTO } from '../dto/IMedicalRecordAllergyDTO';
import { IMedicalRecordConditionDTO } from '../dto/IMedicalRecordConditionDTO';

describe('medical record', function() {
  beforeEach(function() {});
  it('should update allergies in Medical Record', async function() {
    let medicalRecordDTO: IMedicalRecordDTO = {
      id: '1',
      patientId: '1',
      allergies: [
        {
          allergyId: 'All',
          description: 'All description',
        },
      ],
      medicalConditions: [],
      freeTexts: [],
    };
    let updatedAllergy: IMedicalRecordAllergyDTO[] = [
      {
        allergyId: 'Allergy1',
        description: 'Allergy1 description',
      },
    ];
    const updateStub = sinon
      .stub(MedicalRecord.prototype, 'update')
      .callsFake(function(newAllergies: IMedicalRecordAllergyDTO[]) {
        this.allergies = newAllergies;
      });

    const createResult = await MedicalRecord.create(medicalRecordDTO);
    const medicalRecord = createResult.getValue();

    medicalRecord.update(updatedAllergy);

    sinon.assert.calledOnce(updateStub);
    sinon.assert.match(medicalRecord.allergies, updatedAllergy);
    updateStub.restore();
  });
  it('should update medicalConditions in Medical Record', async function() {
    let medicalRecordDTO: IMedicalRecordDTO = {
      id: '1',
      patientId: '1',
      allergies: [],
      medicalConditions: [
        {
          medicalConditionId: 'All',
          description: 'All description',
        },
      ],
      freeTexts: [],
    };
    let updatedMedicalConditions: IMedicalRecordConditionDTO[] = [
      {
        medicalConditionId: 'MedicalCondition1',
        description: 'MedicalCondition1 description',
      },
    ];
    let updatedAllergy: IMedicalRecordAllergyDTO[] = [];
    const updateStub = sinon
      .stub(MedicalRecord.prototype, 'update')
      .callsFake(function(allergies: IMedicalRecordAllergyDTO[], medicalConditions: IMedicalRecordConditionDTO[]) {
        this.medicalConditions = medicalConditions;
      });

    const createResult = await MedicalRecord.create(medicalRecordDTO);
    const medicalRecord = createResult.getValue();

    medicalRecord.update(updatedAllergy, updatedMedicalConditions);

    sinon.assert.calledOnce(updateStub);
    sinon.assert.match(medicalRecord.medicalConditions, updatedMedicalConditions);

    updateStub.restore();
  });
  it('should update freeTexts in Medical Record', async function() {
    let medicalRecordDTO: IMedicalRecordDTO = {
      id: '1',
      patientId: '1',
      allergies: [],
      medicalConditions: [],
      freeTexts: ['Free text test'],
    };

    let updatedFreeTexts: string[] = ['Updated free text'];

    const updateStub = sinon
      .stub(MedicalRecord.prototype, 'update')
      .callsFake(function(
        allergies: IMedicalRecordAllergyDTO[],
        medicalConditions: IMedicalRecordConditionDTO[],
        freeTexts: string[],
      ) {
        this.freeTexts = freeTexts;
      });

    const createResult = await MedicalRecord.create(medicalRecordDTO);
    const medicalRecord = createResult.getValue();

    medicalRecord.update([], [], updatedFreeTexts);

    sinon.assert.calledOnce(updateStub);

    sinon.assert.match(medicalRecord.freeTexts, updatedFreeTexts);

    updateStub.restore();
  });
});
