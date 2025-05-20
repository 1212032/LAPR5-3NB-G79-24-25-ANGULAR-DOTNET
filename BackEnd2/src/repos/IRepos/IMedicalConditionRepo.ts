import { Repo } from "../../core/infra/Repo";
import { MedicalCondition } from "../../domain/medicalCondition";

export default interface IMedicalConditionRepo extends Repo<MedicalCondition> {
	save(medicalCondition: MedicalCondition): Promise<MedicalCondition>;
	findAll(code?: string, name?: string): Promise<MedicalCondition[]>;
	findById(id: string): Promise<MedicalCondition>;
}