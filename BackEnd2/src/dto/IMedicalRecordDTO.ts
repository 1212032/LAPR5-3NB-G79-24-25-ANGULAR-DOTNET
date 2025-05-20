import { IMedicalRecordAllergyDTO } from "./IMedicalRecordAllergyDTO";
import { IMedicalRecordConditionDTO } from "./IMedicalRecordConditionDTO";

export default interface IMedicalRecordDTO {
    id: string;
    patientId: string;
    allergies: IMedicalRecordAllergyDTO[];
    medicalConditions: IMedicalRecordConditionDTO[];
    freeTexts: string[];
}