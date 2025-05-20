import { Request, Response, NextFunction } from 'express';

export default interface IMedicalRecordController {
  createMedicalRecord(req: Request, res: Response, next: NextFunction);
  getAllMedicalRecord(req: Request, res: Response, next: NextFunction);
  getMedicalRecord(recordId: string , req: Request, res: Response, next: NextFunction);
  getMedicalRecordByPatientId(patientId: string , req: Request, res: Response, next: NextFunction);
  updateMedicalRecord(recordId: string ,req: Request, res: Response, next: NextFunction);
}