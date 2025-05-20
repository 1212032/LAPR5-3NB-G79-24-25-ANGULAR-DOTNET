import { MedicalRecordAllergyDTO } from "./MedicalRecordAllergyDTO";
import { MedicalRecordConditionDTO } from "./MedicalRecordConditionDTO";

export default interface MedicalRecordDTO {
    id: string;
    patientId: string,
    allergies: MedicalRecordAllergyDTO[];
    medicalConditions: MedicalRecordConditionDTO[];
    freeTexts: string[];
}