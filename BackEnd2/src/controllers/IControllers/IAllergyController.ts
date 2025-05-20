import { Request, Response, NextFunction } from 'express';

export default interface IAllergyController {
  createAllergy(req: Request, res: Response, next: NextFunction);
  updateAllergy(allergyId: string, req: Request, res: Response, next: NextFunction);
  getAllAllergies(req: Request, res: Response, next: NextFunction);
  getAllergy(allergyId: string, req: Request, res: Response, next: NextFunction);
}