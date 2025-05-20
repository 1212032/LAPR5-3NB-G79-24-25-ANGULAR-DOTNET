export interface CreatePatientRequestDto {
    requestType: string,
    firstName: string,
    lastName: string,
    emergencyContact: string,
    phone: string,
    address: string,
    email: string
}