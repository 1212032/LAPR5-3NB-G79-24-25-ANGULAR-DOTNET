import { OperationTypePhaseDto } from "../../OperationTypes/dto/operationTypePhaseDto";

export interface CreatingOperationTypeDto {
    name: string,
    phases: OperationTypePhaseDto[]
}