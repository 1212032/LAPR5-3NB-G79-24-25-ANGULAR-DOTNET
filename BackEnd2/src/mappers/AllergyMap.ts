import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IAllergyPersistence } from '../dataschema/IAllergyPersistence';

import IAllergyDTO from "../dto/IAllergyDTO";
import { Allergy } from "../domain/allergy";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class AllergyMap extends Mapper<Allergy> {

    public static toDTO(allergy: Allergy): IAllergyDTO {
        return {
            id: allergy.id.toString(),
            code: allergy.code,
            name: allergy.name,
            description: allergy.description,
        } as IAllergyDTO;
    }

    public static toDomain(allergy: any | Model<IAllergyPersistence & Document>): Allergy {
        const allergyOrError = Allergy.create(
            allergy,
            new UniqueEntityID(allergy.domainId)
        );
        return allergyOrError.isSuccess ? allergyOrError.getValue() : null;
    }

    public static toPersistence(allergy: Allergy): any {
        return {
            domainId: allergy.id.toString(),
            code: allergy.code,
            name: allergy.name,
            description: allergy.description
        }
    }
}