import { IMedicalConditionPersistence } from '../../dataschema/IMedicalConditionPersistence';
import mongoose from 'mongoose';

const MedicalConditionSchema = new mongoose.Schema(
  {
    domainId: { type: String, unique: true, index: true },
    name: {
      type: String, unique: true, index: true,
      required: [true, 'Please enter the name']
    },
    code: {
      type: String, unique: true, index: true,
      required: [true, 'Please enter the code']
    },
    description: {
      type: String,
      required: [true, 'Please enter the description']
    },
    symptoms: [{ type: String }]
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IMedicalConditionPersistence & mongoose.Document>('MedicalCondition', MedicalConditionSchema);
