import { Repo } from "../../core/infra/Repo";
import { MedicalRecord } from "../../domain/medicalRecord";

export default interface IMedicalRecordRepo extends Repo<MedicalRecord> {
	save(medicalRecord: MedicalRecord): Promise<MedicalRecord>;
	findAll(): Promise<MedicalRecord[]>;
	findByDomainId(id: string): Promise<MedicalRecord>;
	findByPatientId(id: string): Promise<MedicalRecord>;
}