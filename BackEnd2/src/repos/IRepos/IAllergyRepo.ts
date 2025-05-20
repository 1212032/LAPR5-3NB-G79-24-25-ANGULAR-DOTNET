import { Repo } from "../../core/infra/Repo";
import { Allergy } from "../../domain/allergy";
import { AllergyId } from "../../domain/allergyId";

export default interface IAllergyRepo extends Repo<Allergy> {
    save(allergy: Allergy): Promise<Allergy>;
    findByDomainId(allergyId: AllergyId | string): Promise<Allergy>;
    findAll(code?: string, name?: string): Promise<Allergy[]>;
}