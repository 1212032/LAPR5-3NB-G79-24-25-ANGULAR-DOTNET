import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { MedicalConditionDto } from '../dto/medicalConditionDto';
import { CreatingMedicalConditionDto } from '../dto/creatingMedicalConditionDto';

@Injectable({
    providedIn: 'root',
})
export class MedicalConditionService {
    private baseUrl = environment.backend2Url + 'medicalConditions';
    constructor(private http: HttpClient) { }

    createMedicalCondition(medicalCondition: CreatingMedicalConditionDto): Observable<MedicalConditionDto> {
        let req: Observable<MedicalConditionDto>;
        req = this.http.post<MedicalConditionDto>(this.baseUrl, medicalCondition);
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        );
    }

    getAllMedicalCondition(): Observable<MedicalConditionDto[]> {
        let req: Observable<MedicalConditionDto[]>;
        req = this.http.get<MedicalConditionDto[]>(this.baseUrl);
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        );
    }

    updateMedicalCondition(medicalCondition: MedicalConditionDto): Observable<MedicalConditionDto> {
        let req: Observable<MedicalConditionDto>;
        req = this.http.put<MedicalConditionDto>(this.baseUrl + '/' + medicalCondition.id, medicalCondition);
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        );
    }

    getMedicalConditionById(id: string): Observable<MedicalConditionDto> {
        return this.http.get<MedicalConditionDto>(this.baseUrl + '/' + id);
    }

    getMedicalConditions(code: string, name: string): Observable<MedicalConditionDto[]> {
        let filters = new HttpParams();
        if (code != null && code != '') {
            filters = filters.set('code', code);
        }
        if (name != null && name != '') {
            filters = filters.set('name', name);
        }
        let req: Observable<MedicalConditionDto[]>;
        req = this.http.get<MedicalConditionDto[]>(this.baseUrl, { params: filters });
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        );
    }
}
