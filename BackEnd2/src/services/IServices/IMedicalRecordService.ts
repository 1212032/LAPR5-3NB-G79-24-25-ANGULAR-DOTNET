import { Result } from "../../core/logic/Result";
import IMedicalRecordDTO from "../../dto/IMedicalRecordDTO";

export default interface IMedicalRecordService {
  createMedicalRecord(medicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>>;
  updateMedicalRecord(patientId: string ,medicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>>;
  getMedicalRecord(medicalRecordId: string):Promise<Result<IMedicalRecordDTO>>;
  getMedicalRecordByPatientId(patientId: string):Promise<Result<IMedicalRecordDTO>>;
  getAllMedicalRecords(medicalRecordId?: string, code?: string, name?: string): Promise<Result<IMedicalRecordDTO[]>>;
}