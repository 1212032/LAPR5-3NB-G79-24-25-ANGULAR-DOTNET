import { Service, Inject } from 'typedi';

import { Document, FilterQuery, Model } from 'mongoose';

import IMedicalConditionRepo from './IRepos/IMedicalConditionRepo';
import { IMedicalConditionPersistence } from '../dataschema/IMedicalConditionPersistence';
import { MedicalConditionId } from '../domain/medicalConditionId';
import { MedicalCondition } from '../domain/medicalCondition';
import { MedicalConditionMap } from '../mappers/MedicalConditionMap';

@Service()
export default class MedicalConditionRepo implements IMedicalConditionRepo {
    private models: any;

    constructor(
        @Inject('medicalConditionSchema') private medicalConditionSchema: Model<IMedicalConditionPersistence & Document>,
        @Inject('logger') private logger
    ) { }

    public async exists(medicalCondition: MedicalCondition): Promise<boolean> {

        const idX = medicalCondition.id instanceof MedicalConditionId ? (<MedicalConditionId>medicalCondition.id).toValue() : medicalCondition.id;

        const query = { domainId: idX };
        const mcDocument = await this.medicalConditionSchema.findOne(query);

        return !!mcDocument === true;
    }

    public async save(medicalCondition: MedicalCondition): Promise<MedicalCondition> {
        const query = { domainId: medicalCondition.id.toString() };

        const medicalConditionDocument = await this.medicalConditionSchema.findOne(query);

        try {
            if (medicalConditionDocument === null) {
                const rawMC: any = MedicalConditionMap.toPersistence(medicalCondition);

                const mcCreated = await this.medicalConditionSchema.create(rawMC);

                return MedicalConditionMap.toDomain(mcCreated);
            } else {
                medicalConditionDocument.code = medicalCondition.code;
                medicalConditionDocument.name = medicalCondition.name;
                medicalConditionDocument.description = medicalCondition.description;
                medicalConditionDocument.symptoms = medicalCondition.symptoms;
                await medicalConditionDocument.save();

                return medicalCondition;
            }
        } catch (err) {
            throw err;
        }
    }

    public async findById(medicalConditionId: MedicalConditionId | string): Promise<MedicalCondition> {
        const query = { domainId: medicalConditionId };
        const medicalConditionRecord = await this.medicalConditionSchema.findOne(query as FilterQuery<IMedicalConditionPersistence & Document>);
        if (medicalConditionRecord != null) {
            return MedicalConditionMap.toDomain(medicalConditionRecord);
        } else {
            return null;
        }
    }

    public async findAll(code?: string, name?: string): Promise<MedicalCondition[]> {
        if (code == null) code = '';
        if (name == null) name = '';
        const query = { "code": { "$regex": code, "$options": "i" }, "name": { "$regex": name, "$options": "i" } };
        const medicalConditionRecord = await this.medicalConditionSchema.find(query as FilterQuery<IMedicalConditionPersistence & Document>).sort({ name: 1 });
        if (medicalConditionRecord != null) {
            return Promise.all(medicalConditionRecord.map(cond => MedicalConditionMap.toDomain(cond)));
        } else {
            return null;
        }
    }
}