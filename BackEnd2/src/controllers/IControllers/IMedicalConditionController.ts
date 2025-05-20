import { Request, Response, NextFunction } from 'express';

export default interface IMedicalConditionController {
  createMedicalCondition(req: Request, res: Response, next: NextFunction);
  getAllMedicalConditions(req: Request, res: Response, next: NextFunction);
  updateMedicalCondition(medicalConditionId: string, req: Request, res: Response, next: NextFunction);
  getMedicalCondition(conditionId: string, req: Request, res: Response, next: NextFunction);
}