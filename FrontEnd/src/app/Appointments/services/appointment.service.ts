import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, Observable, throwError } from 'rxjs';
import { CreatingAppointmentDto } from '../dto/creatingAppointmentDto';
import { AppointmentDto } from '../dto/appointmentDto';
import { UpdatingAppointmentDto } from '../dto/updatingAppointmentDto';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
    baseurl = environment.apiUrl
    appointmentUrl = environment.apiUrl + 'Appointments'

    constructor(private http: HttpClient) { }

    createAppointment(appointment: CreatingAppointmentDto): Observable<AppointmentDto> {
        let req: Observable<AppointmentDto>;
        req = this.http.post<AppointmentDto>(this.appointmentUrl, appointment);
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        );
    }

    getAppointmentById(id: number): Observable<AppointmentDto> {
        return this.http.get<AppointmentDto>(this.appointmentUrl + '/' + id);
    }

    updateAppointment(appointment: UpdatingAppointmentDto): Observable<AppointmentDto> {
        let req: Observable<AppointmentDto>;
        req = this.http.put<AppointmentDto>(this.appointmentUrl + '/' + appointment.id, appointment)
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }

    getAppointments(patientName: string, patientMedicalRecordNumber: string, room: string, priority: string,
        startDate: Date, endDate: Date, staff: string): Observable<AppointmentDto[]> {
        let filters = new HttpParams();
        if (patientName != null && patientName != '') {
            filters = filters.set('patientName', patientName);
        }
        if (patientMedicalRecordNumber != null && patientMedicalRecordNumber != '') {
            filters = filters.set('patientMedicalRecordNumber', patientMedicalRecordNumber);
        }
        if (room != null && room != '') {
            filters = filters.set('room', room);
        }
        if (priority != null && priority != '') {
            filters = filters.set('priority', priority);
        }
        startDate = new Date(startDate);
        if (startDate != null && startDate.getTime() > 0) {
            filters = filters.set('startDate', startDate.toISOString());
        }
        endDate = new Date(endDate);
        if (endDate != null && endDate.getTime() > 0) {
            filters = filters.set('endDate', endDate.toISOString());
        }
        if (staff != null && staff != '') {
            filters = filters.set('staff', staff);
        }
        let req: Observable<AppointmentDto[]>;
        req = this.http.get<AppointmentDto[]>(this.appointmentUrl, { params: filters });
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }
}
