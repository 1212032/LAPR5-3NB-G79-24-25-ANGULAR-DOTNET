import { Mapper } from "../core/infra/Mapper";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { MedicalCondition } from '../domain/medicalCondition';
import { IMedicalConditionDTO } from '../dto/IMedicalConditionDTO';
import { IMedicalConditionPersistence } from "../dataschema/IMedicalConditionPersistence";
import { Document, Model } from "mongoose";

export class MedicalConditionMap extends Mapper<MedicalCondition> {

  public static toDTO(medicalCondition: MedicalCondition): IMedicalConditionDTO {
    return {
      id: medicalCondition.id.toString(),
      name: medicalCondition.name,
      code: medicalCondition.code,
      description: medicalCondition.description,
      symptoms: medicalCondition.symptoms,
    } as IMedicalConditionDTO;
  }

  public static async toDomain(medicalCondition: any | Model<IMedicalConditionPersistence & Document>): Promise<MedicalCondition> {

    const medicalConditionOrError = MedicalCondition.create(
      medicalCondition
      , new UniqueEntityID(medicalCondition.domainId))
    return medicalConditionOrError.isSuccess ? medicalConditionOrError.getValue() : null;
  }

  public static toPersistence(medicalCondition: MedicalCondition): any {
    const mc = {
      domainId: medicalCondition.id.toString(),
      name: medicalCondition.name,
      code: medicalCondition.code,
      description: medicalCondition.description,
      symptoms: medicalCondition.symptoms,
    }
    return mc;
  }
}