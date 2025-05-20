export interface CreatingStaffDto {
    licenseNumber: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    role: string;
    availabilitySlots: Array<{item1: Date, item2: Date}>;
    specialization: number;
}