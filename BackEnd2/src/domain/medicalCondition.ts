import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { MedicalConditionId } from "./medicalConditionId";
import { IMedicalConditionDTO } from "../dto/IMedicalConditionDTO";


interface MedicalConditionProps {
  name: string;
  code: string;
  description: string;
  symptoms: string[];
}

export class MedicalCondition extends AggregateRoot<MedicalConditionProps> {
  get id(): UniqueEntityID {
    return this._id;
  }
  get medicalConditionID(): MedicalConditionId {
    return new MedicalConditionId(this.medicalConditionID.toValue());
  }
  get name(): string {
    return this.props.name;
  }
  get code(): string {
    return this.props.code;
  }
  get description(): string {
    return this.props.description;
  }
  get symptoms(): string[] {
    return this.props.symptoms;
  }
  set name(value: string) {
    this.props.name = value;
  }
  set code(value: string) {
    this.props.code = value;
  }
  set description(value: string) {
    this.props.description = value;
  }
  set symptoms(value: string[]) {
    this.props.symptoms = value;
  }

  private constructor(props: MedicalConditionProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(medicalConditionDTO: IMedicalConditionDTO, id?: UniqueEntityID): Result<MedicalCondition> {
    if (!!medicalConditionDTO.code === false || medicalConditionDTO.code.length === 0) {
      return Result.fail<MedicalCondition>('Must provide a medical condition code')
    }
    if (!!medicalConditionDTO.name === false || medicalConditionDTO.name.length === 0) {
      return Result.fail<MedicalCondition>('Must provide a medical condition name')
    }
    if (!!medicalConditionDTO.description === false || medicalConditionDTO.description.length === 0) {
      return Result.fail<MedicalCondition>('Must provide a medical condition description')
    }
    const medicalCondition = new MedicalCondition({ code: medicalConditionDTO.code, name: medicalConditionDTO.name, description: medicalConditionDTO.description, symptoms: medicalConditionDTO.symptoms }, id);
    return Result.ok<MedicalCondition>(medicalCondition)

  }
}