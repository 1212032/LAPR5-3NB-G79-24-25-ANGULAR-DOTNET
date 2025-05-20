import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IMedicalRecordPersistence } from '../dataschema/IMedicalRecordPersistence';

import IMedicalRecordDTO from "../dto/IMedicalRecordDTO";
import { MedicalRecord } from "../domain/medicalRecord";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class MedicalRecordMap extends Mapper<MedicalRecord> {

    public static toDTO(medicalRecord: MedicalRecord): IMedicalRecordDTO {
        return {
            id: medicalRecord.id.toString(),
            patientId: medicalRecord.patientID,
            allergies: medicalRecord.allergies,
            medicalConditions: medicalRecord.medicalConditions,
            freeTexts: medicalRecord.freeTexts
        } as IMedicalRecordDTO;
    }

    public static toDomain(medicalRecord: any | Model<IMedicalRecordPersistence & Document>): MedicalRecord {
        const medicalRecordOrError = MedicalRecord.create(
            medicalRecord,
            new UniqueEntityID(medicalRecord.domainId)
        );
        return medicalRecordOrError.isSuccess ? medicalRecordOrError.getValue() : null;
    }

    public static toPersistence(medicalRecord: MedicalRecord): any {
        return {
            domainId: medicalRecord.id.toString(),
            patientId: medicalRecord.patientID,
            allergies: medicalRecord.allergies,
            medicalConditions: medicalRecord.medicalConditions,
            freeTexts: medicalRecord.freeTexts
        }
    }
}