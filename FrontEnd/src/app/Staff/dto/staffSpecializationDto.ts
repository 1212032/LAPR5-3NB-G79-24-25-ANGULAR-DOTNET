import { StaffDto } from "./staffDto";

export interface StaffSpecializationDto extends StaffDto {
    active: boolean;
    fullName: string;
    specializationName?: string;
}