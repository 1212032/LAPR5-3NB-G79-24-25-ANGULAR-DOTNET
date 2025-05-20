import { IMedicalRecordPersistence } from '../../dataschema/IMedicalRecordPersistence';
import mongoose from 'mongoose';

const MedicalRecordSchema = new mongoose.Schema(
    {
        domainId: { type: String, unique: true, index: true },
        patientId: {type:String, unique: true, index: true},
        allergies: [
            {
                allergyId: { type: String},
                description: { type: String }
            }
        ],
        medicalConditions: [
            {
                medicalConditionId: { type: String },
                description: { type: String }
            }
        ],
        freeTexts: [
            { type: String }
        ]
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IMedicalRecordPersistence & mongoose.Document>('MedicalRecord', MedicalRecordSchema);
