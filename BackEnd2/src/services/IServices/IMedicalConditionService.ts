import { Result } from "../../core/logic/Result";
import { IMedicalConditionDTO } from "../../dto/IMedicalConditionDTO";

export default interface IMedicalConditionService {
  createMedicalCondition(medicalConditionDTO: IMedicalConditionDTO): Promise<Result<IMedicalConditionDTO>>;
  updateMedicalCondition(medicalConditionId: string, medicalConditionDTO: IMedicalConditionDTO): Promise<Result<IMedicalConditionDTO>>;
  getMedicalCondition(medicalConditionId: string): Promise<Result<IMedicalConditionDTO>>;
  getAllMedicalConditions(code?: string, name?: string): Promise<Result<IMedicalConditionDTO[]>>;
}
