import { Service, Inject } from 'typedi';

import { Document, FilterQuery, Model } from 'mongoose';

import IMedicalRecordRepo from './IRepos/IMedicalRecordRepo';
import { IMedicalRecordPersistence } from '../dataschema/IMedicalRecordPersistence';
import { MedicalRecordId } from '../domain/medicalRecordId';
import { MedicalRecord } from '../domain/medicalRecord';
import { MedicalRecordMap } from '../mappers/MedicalRecordMap';

@Service()
export default class MedicalRecordRepo implements IMedicalRecordRepo {
    private models: any;

    constructor(
        @Inject('medicalRecordSchema') private medicalRecordSchema: Model<IMedicalRecordPersistence & Document>,
        @Inject('logger') private logger
    ) { }
    

    public async exists(medicalRecord: MedicalRecord): Promise<boolean> {

        const idX = medicalRecord.id instanceof MedicalRecordId ? (<MedicalRecordId>medicalRecord.id).toValue() : medicalRecord.id;

        const query = { domainId: idX };
        const medicalRecordDocument = await this.medicalRecordSchema.findOne(query as FilterQuery<IMedicalRecordPersistence & Document>);

        return !!medicalRecordDocument === true;
    }

    public async save(medicalRecord: MedicalRecord): Promise<MedicalRecord> {
        const query = { domainId: medicalRecord.id.toString() };

        const medicalRecordDocument = await this.medicalRecordSchema.findOne(query);

        try {
            if (medicalRecordDocument === null) {
                const rawMedicalRecord: any = MedicalRecordMap.toPersistence(medicalRecord);

                const medicalRecordCreated = await this.medicalRecordSchema.create(rawMedicalRecord);

                return MedicalRecordMap.toDomain(medicalRecordCreated);
            } else {
                medicalRecordDocument.allergies = medicalRecord.allergies;
                medicalRecordDocument.medicalConditions = medicalRecord.medicalConditions;
                medicalRecordDocument.freeTexts = medicalRecord.freeTexts;
                await medicalRecordDocument.save();

                return medicalRecord;
            }
        } catch (err) {
            throw err;
        }
    }
    public async findByPatientId(patientId: string): Promise<MedicalRecord> {
        const query = { patientId: patientId };
        const medicalRecordRecord = await this.medicalRecordSchema.findOne(query as FilterQuery<IMedicalRecordPersistence & Document>);
        if (medicalRecordRecord != null) {
            return MedicalRecordMap.toDomain(medicalRecordRecord);
        } else {
            return null;
        }
    }
    public async findByDomainId(medicalRecordId: MedicalRecordId | string): Promise<MedicalRecord> {
        const query = { domainId: medicalRecordId };
        const medicalRecordRecord = await this.medicalRecordSchema.findOne(query as FilterQuery<IMedicalRecordPersistence & Document>);
        if (medicalRecordRecord != null) {
            return MedicalRecordMap.toDomain(medicalRecordRecord);
        } else {
            return null;
        }
    }

    public async findAll(): Promise<MedicalRecord[]> {
        const medicalRecordRecord = await this.medicalRecordSchema.find().sort({ name: 1 });
        if (medicalRecordRecord != null) {
            return Promise.all(medicalRecordRecord.map(cond => MedicalRecordMap.toDomain(cond)));
        } else {
            return null;
        }
    }
}