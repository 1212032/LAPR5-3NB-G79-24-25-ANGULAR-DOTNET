import { UpdatingAppointmentDto } from "./updatingAppointmentDto";

export interface AppointmentDto extends UpdatingAppointmentDto {
    status: string
    patientId: string
    patientFullName: string
    surgeryRoomName: string
}