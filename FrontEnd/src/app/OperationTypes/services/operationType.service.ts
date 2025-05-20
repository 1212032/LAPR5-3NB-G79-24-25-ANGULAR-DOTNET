import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, Observable, throwError } from 'rxjs';
import { SpecializationDto } from '../../Staff/dto/specializationDto';
import { CreatingOperationTypeDto } from '../dto/creatingOperationTypeDto';
import { UpdatingOperationTypeDto } from '../dto/updatingOperationTypeDto';
import { OperationTypeDto } from '../dto/operationTypeDto';

@Injectable({ providedIn: 'root' })
export class OperationTypeService {
    baseurl = environment.apiUrl
    operationTypeUrl = environment.apiUrl + 'OperationTypes'

    constructor(private http: HttpClient) { }

    getAllSpecializations(): Observable<SpecializationDto[]> {
        let req: Observable<SpecializationDto[]>;
        req = this.http.get<SpecializationDto[]>(this.baseurl + 'specializations');
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        );
    }

    getAllOperationTypes(): Observable<OperationTypeDto[]> {
        let req: Observable<OperationTypeDto[]>;
        req = this.http.get<OperationTypeDto[]>(this.operationTypeUrl);
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        );
    }

    getOperationTypes(name: string, specialization: number, active: boolean): Observable<OperationTypeDto[]> {
        let filters = new HttpParams();
        if (name != null && name != '') {
            filters = filters.set('name', name);
        }
        if (specialization != null && specialization > 0) {
            filters = filters.set('specialization', specialization);
        }
        if (active != null) {
            filters = filters.set('active', active);
        }
        let req: Observable<OperationTypeDto[]>;
        req = this.http.get<OperationTypeDto[]>(this.operationTypeUrl,
            {
                params: filters
            });
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }

    getOperationTypeById(id: number): Observable<OperationTypeDto> {
        return this.http.get<OperationTypeDto>(this.operationTypeUrl + '/' + id);
    }

    createOperationType(operationType: CreatingOperationTypeDto): Observable<OperationTypeDto> {
        let req: Observable<OperationTypeDto>;
        req = this.http.post<OperationTypeDto>(this.operationTypeUrl, operationType);
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        );
    }

    updateOperationType(operationType: UpdatingOperationTypeDto): Observable<OperationTypeDto> {
        let req: Observable<OperationTypeDto>;
        req = this.http.put<OperationTypeDto>(this.operationTypeUrl + '/' + operationType.id, operationType)
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }

    inactivateOperationType(id: number) {
        let req: Observable<OperationTypeDto>;
        req = this.http.delete<OperationTypeDto>(this.operationTypeUrl + '/' + id)
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                //catch all errors 
                return throwError(() => error);
            })
        )
    }
}
