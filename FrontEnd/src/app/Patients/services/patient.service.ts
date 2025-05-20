import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { PatientModel } from '../model/patientModel';
import { MessageDto } from '../../PatientUser/dto/messageDto';

@Injectable({
    providedIn: 'root',
})
export class PatientService {
    private baseUrl = `${environment.apiUrl}patients`;

    constructor(private http: HttpClient) { }

    getAllPatients(): Observable<PatientModel[]> {
        return this.http.get<PatientModel[]>(this.baseUrl).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    searchPatients(queryParams: {
        name?: string;
        email?: string;
        dateOfBirth?: string;
        medicalRecordNumber?: string;
        pageNumber?: number;
        pageSize?: number;
    }): Observable<PatientModel[]> {
        let params = new HttpParams();

        Object.entries(queryParams).forEach(([key, value]) => {
            if (value) {
                params = params.set(key, value.toString());
            }
        });

        return this.http.get<PatientModel[]>(`${this.baseUrl}/search?${params}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    getPatientById(id: string): Observable<PatientModel> {
        return this.http.get<PatientModel>(`${this.baseUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }


    createPatient(patient: PatientModel): Observable<PatientModel> {
        return this.http.post<PatientModel>(this.baseUrl, patient).pipe(
            catchError(this.handleError)
        );
    }

    updatePatient(id: string, patient: PatientModel): Observable<PatientModel> {
        return this.http.put<PatientModel>(`${this.baseUrl}/${id}`, patient).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Delete a patient.
     */
    deletePatient(id: string) {
        let req: Observable<MessageDto>;
        req = this.http.delete<MessageDto>(`${this.baseUrl}/${id}`)
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }

    /**
     * Handle HTTP errors.
     */
    private handleError(error: any) {
        let errorMessage = '';
        if (error instanceof HttpErrorResponse) {
            return throwError(() => error);
        } else if (error.error instanceof ErrorEvent) {
            // Client-side errors
            errorMessage = `Client Error: ${error.error.message}`;
        } else {
            // Server-side errors
            errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(() => errorMessage);
    }
}
