import { AppointmentPhaseDto } from "./appointmentPhaseDto";

export interface CreatingAppointmentDto {
    dateTime: Date,
    originatingOperationRequest: number,
    room: string,
    phases: AppointmentPhaseDto[]
}