import { IAllergyPersistence } from '../../dataschema/IAllergyPersistence';
import mongoose from 'mongoose';

const AllergySchema = new mongoose.Schema(
    {
        domainId: { type: String, unique: true, index: true },
        code: {
            type: String, unique: true, index: true,
            required: [true, 'Please enter the code']
        },
        name: {
            type: String, unique: true, index: true,
            required: [true, 'Please enter the name']
        },
        description: {
            type: String, required: [false]
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IAllergyPersistence & mongoose.Document>('Allergy', AllergySchema);
