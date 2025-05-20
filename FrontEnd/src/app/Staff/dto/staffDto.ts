import { UpdatingStaffDto } from "./updatingStaffDto";

export interface StaffDto extends UpdatingStaffDto {
    active: boolean;
    fullName: string;
}