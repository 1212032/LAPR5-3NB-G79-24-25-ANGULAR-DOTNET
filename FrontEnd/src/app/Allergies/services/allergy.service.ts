import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AllergyDto } from '../../Allergies/dto/allergyDto';
import { CreatingAllergyDto } from '../../Allergies/dto/creatingAllergyDto';

@Injectable({
    providedIn: 'root',
})
export class AllergyService {
    private baseUrl = environment.backend2Url + 'allergies';
    constructor(private http: HttpClient) { }

    createAllergy(allergy: CreatingAllergyDto): Observable<AllergyDto> {
        let req: Observable<AllergyDto>;
        req = this.http.post<AllergyDto>(this.baseUrl, allergy);
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        );
    }

    updateAllergy(allergy: AllergyDto): Observable<AllergyDto> {
        let req: Observable<AllergyDto>;
        req = this.http.put<AllergyDto>(this.baseUrl + '/' + allergy.id, allergy);
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        );
    }

    getAllergyById(id: string): Observable<AllergyDto> {
        return this.http.get<AllergyDto>(this.baseUrl + '/' + id);
    }

    getAllAllergies(): Observable<AllergyDto[]> {
        let req: Observable<AllergyDto[]>;
        req = this.http.get<AllergyDto[]>(this.baseUrl);
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        );
    }

    getAllergies(code: string, name: string): Observable<AllergyDto[]> {
        let filters = new HttpParams();
        if (code != null && code != '') {
            filters = filters.set('code', code);
        }
        if (name != null && name != '') {
            filters = filters.set('name', name);
        }
        let req: Observable<AllergyDto[]>;
        req = this.http.get<AllergyDto[]>(this.baseUrl, { params: filters });
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        );
    }
}
