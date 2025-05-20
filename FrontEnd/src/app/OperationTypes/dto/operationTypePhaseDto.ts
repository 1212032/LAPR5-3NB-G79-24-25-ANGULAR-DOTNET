export interface OperationTypePhaseDto {
    name: string;
    duration: number;
    specializations: { [key: number]: number }; //<SpecializationId,Count>
}
