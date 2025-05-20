import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, Observable, throwError } from 'rxjs';
import { OperationTypeDto } from '../../OperationTypes/dto/operationTypeDto';
import { PatientDto } from '../../Patients/dto/patientDto';
import { CreatingOperationRequestDto } from '../dto/creatingOperationRequestDto';
import { OperationRequestDto } from '../dto/operationRequestDto';
import { UpdatingOperationRequestDto } from '../dto/updatingOperationRequestDto';

@Injectable({
    providedIn: 'root'
})
export class OperationRequestService {
    baseurl = environment.apiUrl
    operationRequestsUrl = environment.apiUrl + 'OperationRequests'

    constructor(private http: HttpClient) { }

    getAllOperationTypes(): Observable<OperationTypeDto[]> {
        let req: Observable<OperationTypeDto[]>;

        req = this.http.get<OperationTypeDto[]>(this.baseurl + 'operationTypes');
        return req.pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        );
    }
    getAllPatients(): Observable<PatientDto[]> {
        let req: Observable<PatientDto[]>;

        req = this.http.get<PatientDto[]>(this.baseurl + 'patients');
        return req.pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        );
    }
    getOperationRequestById(id: number): Observable<OperationRequestDto> {
        return this.http.get<OperationRequestDto>(this.operationRequestsUrl + '/' + id);
    }
    createOperationRequest(operationRequest: CreatingOperationRequestDto): Observable<OperationRequestDto> {
        let req: Observable<OperationRequestDto>;
        req = this.http.post<OperationRequestDto>(this.operationRequestsUrl, operationRequest); //
        return req.pipe(
            catchError((error) => {
                if (error.status == 500) {
                    return throwError(() => 'Invalid Date format, please fill with dd/mm/yyyy hh:mm:ss');
                }
                return throwError(() => error);
            })
        );
    }
    updateOperationRequest(operationRequest: UpdatingOperationRequestDto): Observable<OperationRequestDto> {
        let req: Observable<OperationRequestDto>;
        req = this.http.put<OperationRequestDto>(this.operationRequestsUrl + '/' + operationRequest.id, operationRequest)
        return req.pipe(
            catchError((error) => {
                if (error.status == 500) {
                    return throwError(() => 'Invalid Date format, please fill with dd/mm/yyyy hh:mm:ss');
                }
                //catch all errors 
                return throwError(() => error);
            })
        )
    }
    removeOperationRequest(id: number): Observable<OperationRequestDto> {
        let req: Observable<OperationRequestDto>;
        req = this.http.delete<OperationRequestDto>(this.operationRequestsUrl + '/' + id
        )
        return req.pipe(
            catchError((error) => {

                //catch all errors 
                return throwError(() => error);
            })
        )
    }
    searchOperationRequestWithFilters(priority: string,
        operationType: number,
        patientName: string,
        patientMedicalRecordNumber: string,
        startDate: Date,
        endDate: Date): Observable<OperationRequestDto[]> {

        let filters = new HttpParams();
        if (priority != null && priority != '') {
            filters = filters.set('priority', priority);
        }
        if (operationType != null && operationType > 0) {
            filters = filters.set('operationType', operationType);
            //filters.append('operationType', operationType);
        }
        if (patientName != null && patientName != '') {
            filters = filters.set('patientName', patientName);
        }
        if (patientMedicalRecordNumber != null && patientMedicalRecordNumber != '') {
            filters = filters.set('patientMedicalRecordNumber', patientMedicalRecordNumber);
        }

        if (startDate != null && startDate.getTime() > 0) {
            filters = filters.set('startDate', startDate.toISOString());
        }
        if (endDate != null && endDate.getTime() > 0) {
            filters = filters.set('endDate', endDate.toISOString());
        }

        let url: string = this.operationRequestsUrl.concat("/filter?");
        let req: Observable<OperationRequestDto[]>;
        req = this.http.get<OperationRequestDto[]>(url,
            { params: filters });
        return req.pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }
}
