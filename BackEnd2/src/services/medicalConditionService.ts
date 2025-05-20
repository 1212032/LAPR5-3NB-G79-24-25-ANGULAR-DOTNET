import { Service, Inject } from 'typedi';
import config from '../../config';
import { MedicalCondition } from "../domain/medicalCondition";
import { Result } from '../core/logic/Result';
import IMedicalConditionService from './IServices/IMedicalConditionService';
import { IMedicalConditionDTO } from '../dto/IMedicalConditionDTO';
import { MedicalConditionMap } from '../mappers/MedicalConditionMap';
import IMedicalConditionRepo from '../repos/IRepos/IMedicalConditionRepo';

@Service()
export default class MedicalConditionService implements IMedicalConditionService {
    constructor(@Inject(config.repos.medicalCondition.name) private medicalConditionRepo: IMedicalConditionRepo) { }

    public async getAllMedicalConditions(code?: string, name?: string): Promise<Result<IMedicalConditionDTO[]>> {
        try {
            const medicalCondition = await this.medicalConditionRepo.findAll(code, name);

            if (medicalCondition === null) {
                return Result.fail<IMedicalConditionDTO[]>('Medical conditions not found');
            } else {
                const medicalConditionDTOResult = medicalCondition.map(
                    cond => MedicalConditionMap.toDTO(cond) as IMedicalConditionDTO,
                );
                return Result.ok<IMedicalConditionDTO[]>(medicalConditionDTOResult);
            }
        } catch (e) {
            throw e;
        }
    }

    public async getMedicalCondition(medicalConditionId: string): Promise<Result<IMedicalConditionDTO>> {
        try {
            const medicalCondition = await this.medicalConditionRepo.findById(medicalConditionId);

            if (medicalCondition === null) {
                return Result.fail<IMedicalConditionDTO>('Medical condition not found');
            } else {
                const medicalConditionDTOResult = MedicalConditionMap.toDTO(medicalCondition) as IMedicalConditionDTO;
                return Result.ok<IMedicalConditionDTO>(medicalConditionDTOResult);
            }
        } catch (e) {
            throw e;
        }
    }

    public async createMedicalCondition(
        medicalConditionDTO: IMedicalConditionDTO,
    ): Promise<Result<IMedicalConditionDTO>> {
        try {
            const medicalConditionOrError = await MedicalCondition.create(medicalConditionDTO);

            if (medicalConditionOrError.isFailure) {
                return Result.fail<IMedicalConditionDTO>(medicalConditionOrError.errorValue());
            }

            const medicalConditionResult = medicalConditionOrError.getValue();

            await this.medicalConditionRepo.save(medicalConditionResult);

            const medicalConditionDTOResult = MedicalConditionMap.toDTO(medicalConditionResult) as IMedicalConditionDTO;
            return Result.ok<IMedicalConditionDTO>(medicalConditionDTOResult);
        } catch (e) {
            throw e;
        }
    }

    public async updateMedicalCondition(medicalConditionId: string, medicalConditionDTO: IMedicalConditionDTO): Promise<Result<IMedicalConditionDTO>> {
        try {
            const medicalCondition = await this.medicalConditionRepo.findById(medicalConditionId);
            
            if (medicalCondition === null) {
                return Result.fail<IMedicalConditionDTO>('Medical condition not found');
            } else {
                medicalCondition.code = medicalConditionDTO.code;
                medicalCondition.name = medicalConditionDTO.name;
                medicalCondition.description = medicalConditionDTO.description;
                medicalCondition.symptoms = medicalConditionDTO.symptoms;
                await this.medicalConditionRepo.save(medicalCondition);

                const medicalConditionDTOResult = MedicalConditionMap.toDTO(medicalCondition) as IMedicalConditionDTO;
                return Result.ok<IMedicalConditionDTO>(medicalConditionDTOResult);
            }
        } catch (e) {
            throw e;
        }
    }
}
