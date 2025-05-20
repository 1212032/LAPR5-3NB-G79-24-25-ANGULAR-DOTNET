import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

import { Result } from "../core/logic/Result";
import { AllergyId } from "./allergyId";

import IAllergyDTO from "../dto/IAllergyDTO";

interface AllergyProps {
    code: string;
    name: string;
    description: string;
}

export class Allergy extends AggregateRoot<AllergyProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get allergyId(): AllergyId {
        return new AllergyId(this.allergyId.toValue());
    }

    get code(): string {
        return this.props.code;
    }
    set code(value: string) {
        this.props.code = value;
    }

    get name(): string {
        return this.props.name;
    }
    set name(value: string) {
        this.props.name = value;
    }

    get description(): string {
        return this.props.description;
    }
    set description(value: string) {
        this.props.description = value;
    }

    private constructor(props: AllergyProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(allergyDTO: IAllergyDTO, id?: UniqueEntityID): Result<Allergy> {
        if (!!allergyDTO.code === false || allergyDTO.code.length === 0) {
            return Result.fail<Allergy>('Must provide an allergy code')
        }
        if (!!allergyDTO.name === false || allergyDTO.name.length === 0) {
            return Result.fail<Allergy>('Must provide an allergy name')
        }
        if (!!allergyDTO.description === false || allergyDTO.description.length === 0) {
            return Result.fail<Allergy>('Must provide an allergy description')
        }
        const allergy = new Allergy({ code: allergyDTO.code, name: allergyDTO.name, description: allergyDTO.description }, id);
        return Result.ok<Allergy>(allergy)
    }
}
