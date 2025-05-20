import { Router } from 'express';
import allergy from './routes/allergyRoute';
import medicalCondition from './routes/medicalConditionRoute';
import medicalRecord from './routes/medicalRecordRoute';

export default () => {
	const app = Router();

	allergy(app);
	medicalCondition(app);
	medicalRecord(app);

	return app
}