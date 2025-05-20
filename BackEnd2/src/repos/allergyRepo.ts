import { Service, Inject } from 'typedi';

import IAllergyRepo from "./IRepos/IAllergyRepo";
import { Allergy } from "../domain/allergy";
import { AllergyId } from "../domain/allergyId";
import { AllergyMap } from "../mappers/AllergyMap";

import { Document, FilterQuery, Model } from 'mongoose';
import { IAllergyPersistence } from '../dataschema/IAllergyPersistence';

@Service()
export default class AllergyRepo implements IAllergyRepo {
    private models: any;

    constructor(
        @Inject('allergySchema') private allergySchema: Model<IAllergyPersistence & Document>,
        @Inject('logger') private logger
    ) { }

    public async exists(allergy: Allergy): Promise<boolean> {

        const idX = allergy.id instanceof AllergyId ? (<AllergyId>allergy.id).toValue() : allergy.id;

        const query = { domainId: idX };
        const allergyDocument = await this.allergySchema.findOne(query as FilterQuery<IAllergyPersistence & Document>);

        return !!allergyDocument === true;
    }

    public async save(allergy: Allergy): Promise<Allergy> {
        const query = { domainId: allergy.id.toString() };

        const allergyDocument = await this.allergySchema.findOne(query);

        try {
            if (allergyDocument === null) {
                const rawAllergy: any = AllergyMap.toPersistence(allergy);

                const allergyCreated = await this.allergySchema.create(rawAllergy);

                return AllergyMap.toDomain(allergyCreated);
            } else {
                allergyDocument.code = allergy.code;
                allergyDocument.name = allergy.name;
                allergyDocument.description = allergy.description;
                await allergyDocument.save();

                return allergy;
            }
        } catch (err) {
            throw err;
        }
    }

    public async findByDomainId(allergyId: AllergyId | string): Promise<Allergy> {

        const query = { domainId: allergyId };
        const allergyRecord = await this.allergySchema.findOne(query as FilterQuery<IAllergyPersistence & Document>);
        if (allergyRecord != null) {
            return AllergyMap.toDomain(allergyRecord);
        } else {
            return null;
        }
    }

    public async findAll(code?: string, name?: string): Promise<Allergy[]> {
        if (code == null) code = '';
        if (name == null) name = '';
        const query = { "code": { "$regex": code, "$options": "i" }, "name": { "$regex": name, "$options": "i" } };
        const allergyRecord = await this.allergySchema.find(query as FilterQuery<IAllergyPersistence & Document>).sort({ name: 1 });
        if (allergyRecord != null) {
            return Promise.all(allergyRecord.map(cond => AllergyMap.toDomain(cond)));
        } else {
            return null;
        }
    }
}