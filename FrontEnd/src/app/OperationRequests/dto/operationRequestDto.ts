import { UpdatingOperationRequestDto } from "./updatingOperationRequestDto";

export interface OperationRequestDto extends UpdatingOperationRequestDto {
    status: string
}