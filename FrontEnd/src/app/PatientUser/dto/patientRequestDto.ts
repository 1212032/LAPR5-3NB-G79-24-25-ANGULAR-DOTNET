export interface PatientRequestDto {
    id: number,
    requestType: string,
    firstName: string,
    lastName: string,
    emergencyContact: string,
    phone: string,
    address: string,
    email: string,
    requestedBy: string,
    requestDateTime: Date,
    requestDateTimeString: string
}