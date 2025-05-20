import { AllergyDto } from "../../Allergies/dto/allergyDto";
import { MedicalConditionDto } from "../../MedicalConditions/dto/medicalConditionDto";

export interface PatientMedicalRecordDto {
  
  allergies: AllergyDto[];
  allergiesDescriptions: string[];

  medicalConditions: MedicalConditionDto[];
  medicalConditionsDescriptions: string[];

  freeTexts: string[];
}
