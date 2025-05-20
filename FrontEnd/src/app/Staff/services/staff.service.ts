import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, Observable, throwError } from 'rxjs';
import { SpecializationDto } from '../dto/specializationDto';
import { CreatingStaffDto } from '../dto/creatingStaffDto';
import { UpdatingStaffDto } from '../dto/updatingStaffDto';
import { StaffDto } from '../dto/staffDto';

@Injectable({ providedIn: 'root' })
export class StaffService {
    baseurl = environment.apiUrl
    staffUrl = environment.apiUrl + 'Staff'

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

    getAllStaff(): Observable<StaffDto[]> {
        let req: Observable<StaffDto[]>;

        req = this.http.get<StaffDto[]>(this.staffUrl);
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        );
    }

    getStaff(licenseNumber: string, fullName: string, role: string, specialization: number, active: boolean): Observable<StaffDto[]> {
        let filters = new HttpParams();
        if (licenseNumber != null && licenseNumber != '') {
            filters = filters.set('licenseNumber', licenseNumber);
        }
        if (fullName != null && fullName != '') {
            filters = filters.set('name', fullName);
        }
        if (role != null && role != '') {
            filters = filters.set('role', role);
        }
        if (specialization != null && specialization > 0) {
            filters = filters.set('specialization', specialization);
        }
        if (active != null) {
            filters = filters.set('active', active);
        }
        let req: Observable<StaffDto[]>;
        req = this.http.get<StaffDto[]>(this.staffUrl, { params: filters });
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }

    getStaffById(id: string): Observable<StaffDto> {
        return this.http.get<StaffDto>(this.staffUrl + '/' + id);
    }

    createStaff(staff: CreatingStaffDto): Observable<StaffDto> {
        let req: Observable<StaffDto>;
        req = this.http.post<StaffDto>(this.staffUrl, staff);
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        );
    }

    updateStaff(staff: UpdatingStaffDto): Observable<StaffDto> {
        let req: Observable<StaffDto>;
        req = this.http.put<StaffDto>(this.staffUrl + '/' + staff.id, staff)
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }

    inactivateStaff(id: string) {
        let req: Observable<StaffDto>;
        req = this.http.delete<StaffDto>(this.staffUrl + '/' + id)
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                //catch all errors 
                return throwError(() => error);
            })
        )
    }
}
