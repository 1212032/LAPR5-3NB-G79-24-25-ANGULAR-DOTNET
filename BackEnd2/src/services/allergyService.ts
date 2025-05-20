import { Service, Inject } from 'typedi';
import config from "../../config";
import IAllergyDTO from '../dto/IAllergyDTO';
import { Allergy } from "../domain/allergy";
import IAllergyRepo from '../repos/IRepos/IAllergyRepo';
import IAllergyService from './IServices/IAllergyService';
import { Result } from "../core/logic/Result";
import { AllergyMap } from "../mappers/AllergyMap";

@Service()
export default class AllergyService implements IAllergyService {
    constructor(
        @Inject(config.repos.allergy.name) private allergyRepo: IAllergyRepo
    ) { }

    public async getAllAllergies(code?: string, name?: string): Promise<Result<IAllergyDTO[]>> {
        try {
            const allergy = await this.allergyRepo.findAll(code, name);

            if (allergy === null) {
                return Result.fail<IAllergyDTO[]>('Allergies not found');
            } else {
                const allergyDTOResult = allergy.map(
                    cond => AllergyMap.toDTO(cond) as IAllergyDTO,
                );
                return Result.ok<IAllergyDTO[]>(allergyDTOResult);
            }
        } catch (e) {
            throw e;
        }
    }

    public async getAllergy(allergyId: string): Promise<Result<IAllergyDTO>> {
        try {
            const allergy = await this.allergyRepo.findByDomainId(allergyId);

            if (allergy === null) {
                return Result.fail<IAllergyDTO>("Allergy not found");
            }
            else {
                const allergyDTOResult = AllergyMap.toDTO(allergy) as IAllergyDTO;
                return Result.ok<IAllergyDTO>(allergyDTOResult)
            }
        } catch (e) {
            throw e;
        }
    }

    public async createAllergy(allergyDTO: IAllergyDTO): Promise<Result<IAllergyDTO>> {
        try {

            const allergyOrError = await Allergy.create(allergyDTO);

            if (allergyOrError.isFailure) {
                return Result.fail<IAllergyDTO>(allergyOrError.errorValue());
            }

            const allergyResult = allergyOrError.getValue();

            await this.allergyRepo.save(allergyResult);

            const allergyDTOResult = AllergyMap.toDTO(allergyResult) as IAllergyDTO;
            return Result.ok<IAllergyDTO>(allergyDTOResult)
        } catch (e) {
            throw e;
        }
    }

    public async updateAllergy(allergyId: string, allergyDTO: IAllergyDTO): Promise<Result<IAllergyDTO>> {
        try {
            const allergy = await this.allergyRepo.findByDomainId(allergyId);

            if (allergy === null) {
                return Result.fail<IAllergyDTO>("Allergy not found");
            }
            else {
                allergy.code = allergyDTO.code;
                allergy.name = allergyDTO.name;
                allergy.description = allergyDTO.description;
                await this.allergyRepo.save(allergy);

                const allergyDTOResult = AllergyMap.toDTO(allergy) as IAllergyDTO;
                return Result.ok<IAllergyDTO>(allergyDTOResult)
            }
        } catch (e) {
            throw e;
        }
    }

}
