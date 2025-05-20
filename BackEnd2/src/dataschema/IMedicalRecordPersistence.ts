export interface IMedicalRecordPersistence {
	patientId: string,
	allergies: IMedicalRecordAllergyPersistence[];
	medicalConditions: IMedicalRecordConditionPersistence[];
	freeTexts: string[];
}
interface IMedicalRecordAllergyPersistence {
	allergyId: string;
	description: string;
}
interface IMedicalRecordConditionPersistence {
	medicalConditionId: string;
	description: string;
}