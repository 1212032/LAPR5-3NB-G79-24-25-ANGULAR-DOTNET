import { Service, Inject } from 'typedi';
import config from '../../config';
import { MedicalRecord } from '../domain/medicalRecord';
import { Result } from '../core/logic/Result';
import IMedicalRecordService from './IServices/IMedicalRecordService';
import IMedicalRecordDTO from '../dto/IMedicalRecordDTO';
import { MedicalRecordMap } from '../mappers/MedicalRecordMap';
import IMedicalRecordRepo from '../repos/IRepos/IMedicalRecordRepo';

@Service()
export default class MedicalRecordService implements IMedicalRecordService {
    constructor(@Inject(config.repos.medicalRecord.name) private medicalRecordRepo: IMedicalRecordRepo) { }
   
    getAllMedicalRecords(medicalRecordId?: string, code?: string, name?: string): Promise<Result<IMedicalRecordDTO[]>> {
        throw new Error('Method not implemented.');
    }
    public async getMedicalRecordByPatientId(patientId: string): Promise<Result<IMedicalRecordDTO>>{
        try {
            const medicalRecord = await this.medicalRecordRepo.findByPatientId(patientId);

            if (medicalRecord === null) {
                return Result.fail<IMedicalRecordDTO>('Medical record not found');
            } else {
                const medicalRecordDTOResult = MedicalRecordMap.toDTO(medicalRecord) as IMedicalRecordDTO;
                return Result.ok<IMedicalRecordDTO>(medicalRecordDTOResult);
            }
        } catch (e) {
            throw e;
        }
    }
    public async getMedicalRecord(medicalRecordId: string): Promise<Result<IMedicalRecordDTO>> {
        try {
            const medicalRecord = await this.medicalRecordRepo.findByDomainId(medicalRecordId);

            if (medicalRecord === null) {
                return Result.fail<IMedicalRecordDTO>('Medical record not found');
            } else {
                const medicalRecordDTOResult = MedicalRecordMap.toDTO(medicalRecord) as IMedicalRecordDTO;
                return Result.ok<IMedicalRecordDTO>(medicalRecordDTOResult);
            }
        } catch (e) {
            throw e;
        }
    }

    public async createMedicalRecord(medicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>> {
        try {
            const medicalRecordOrError = await MedicalRecord.create(medicalRecordDTO);

            if (medicalRecordOrError.isFailure) {
                return Result.fail<IMedicalRecordDTO>(medicalRecordOrError.errorValue());
            }

            const medicalRecordResult = medicalRecordOrError.getValue();

            await this.medicalRecordRepo.save(medicalRecordResult);

            const medicalRecordDTOResult = MedicalRecordMap.toDTO(medicalRecordResult) as IMedicalRecordDTO;
            return Result.ok<IMedicalRecordDTO>(medicalRecordDTOResult);
        } catch (e) {
            throw e;
        }
    }

    public async updateMedicalRecord(patientId: string ,medicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>> {
        try {
            const medicalRecord = await this.medicalRecordRepo.findByPatientId(patientId);

            if (medicalRecord === null) {
                medicalRecordDTO.patientId = patientId;

                return this.createMedicalRecord(medicalRecordDTO);
                //return Result.fail<IMedicalRecordDTO>('Medical record not found');
            } else {
                medicalRecord.update(medicalRecordDTO.allergies, medicalRecordDTO.medicalConditions, medicalRecordDTO.freeTexts);
                
                await this.medicalRecordRepo.save(medicalRecord);

                const medicalRecordDTOResult = MedicalRecordMap.toDTO(medicalRecord) as IMedicalRecordDTO;
                return Result.ok<IMedicalRecordDTO>(medicalRecordDTOResult);
            }
        } catch (e) {
            throw e;
        }
    }
}
