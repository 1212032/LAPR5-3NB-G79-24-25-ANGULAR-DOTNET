import { CreatingOperationRequestDto } from "./creatingOperationRequestDto";

export interface UpdatingOperationRequestDto extends CreatingOperationRequestDto {
    id: number
}