import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, Observable, throwError } from 'rxjs';
import { PatientRequestDto } from '../dto/patientRequestDto';
import { PatientDto } from '../dto/patientDto';
import { CreatePatientRequestDto } from '../dto/createPatientRequestDto';

@Injectable({ providedIn: 'root' })
export class PatientUserService {
    baseurl = environment.apiUrl
    patientRequestUrl = environment.apiUrl + 'PatientRequests'

    constructor(private http: HttpClient) { }

    getPatient(): Observable<PatientDto> {
        let req: Observable<PatientDto>;
        req = this.http.get<PatientDto>(this.patientRequestUrl + '/patient')
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }

    sendPatientRequest(patientRequest: CreatePatientRequestDto): Observable<PatientRequestDto> {
        let req: Observable<PatientRequestDto>;
        req = this.http.post<PatientRequestDto>(this.patientRequestUrl, patientRequest)
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }

    deleteRequest(patientRequestId: number): Observable<PatientRequestDto> {
        let req: Observable<PatientRequestDto>;
        req = this.http.delete<PatientRequestDto>(this.patientRequestUrl + '/' + patientRequestId)
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }

    getRequests(): Observable<PatientRequestDto[]> {
        let req: Observable<PatientRequestDto[]>;
        req = this.http.get<PatientRequestDto[]>(this.patientRequestUrl + '/all')
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }
}
