import { AggregateRoot } from '../core/domain/AggregateRoot';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';

import { Result } from '../core/logic/Result';
import { MedicalRecordId } from './medicalRecordId';

import IMedicalRecordDTO from '../dto/IMedicalRecordDTO';

interface MedicalRecordAllergyProps {
  allergyId: string;
  description: string;
}
interface MedicalRecordConditionProps {
  medicalConditionId: string;
  description: string;
}
interface MedicalRecordProps {
  patientId: string;
  allergies: MedicalRecordAllergyProps[];
  medicalConditions: MedicalRecordConditionProps[];
  freeTexts: string[];
}

export class MedicalRecord extends AggregateRoot<MedicalRecordProps> {
  get id(): UniqueEntityID {
    return this._id;
  }
  get patientID(): string{
    return this.props.patientId;
  }
  get medicalRecordId(): MedicalRecordId {
    return new MedicalRecordId(this.medicalRecordId.toValue());
  }

  get allergies(): MedicalRecordAllergyProps[] {
    return this.props.allergies;
  }
  set allergies(value: MedicalRecordAllergyProps[]) {
    this.props.allergies = value;
  }

  get medicalConditions(): MedicalRecordConditionProps[] {
    return this.props.medicalConditions;
  }
  set medicalConditions(value: MedicalRecordConditionProps[]) {
    this.props.medicalConditions = value;
  }

  get freeTexts(): string[] {
    return this.props.freeTexts;
  }
  set freeTexts(value: string[]) {
    this.props.freeTexts = value;
  }

  private constructor(props: MedicalRecordProps, id?: UniqueEntityID) {
    super(props, id);
  }
  public update(allergies?: MedicalRecordAllergyProps[], medicalConditions?: MedicalRecordConditionProps[], freeTexts?: string[] ) {
    if(allergies){
      this.allergies = allergies;
    }
    if(medicalConditions){
      this.medicalConditions = medicalConditions;
    }
    if(freeTexts){
      this.freeTexts = freeTexts;
    }
  }
  public static create(medicalRecordDTO: IMedicalRecordDTO, id?: UniqueEntityID): Result<MedicalRecord> {
    const medicalRecord = new MedicalRecord(
      {
        patientId:medicalRecordDTO.patientId,
        allergies: medicalRecordDTO.allergies,
        medicalConditions: medicalRecordDTO.medicalConditions,
        freeTexts: medicalRecordDTO.freeTexts,
      },
      id,
    );
    return Result.ok<MedicalRecord>(medicalRecord);
  }
}
