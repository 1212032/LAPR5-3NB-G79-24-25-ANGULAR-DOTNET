import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, Observable, throwError } from 'rxjs';
import { SurgeryRoomDto } from '../dto/surgeryRoomDto';

@Injectable({ providedIn: 'root' })
export class SurgeryRoomService {
    baseurl = environment.apiUrl
    roomUrl = environment.apiUrl + 'SurgeryRoom'

    constructor(private http: HttpClient) { }

    getAllSurgeryRooms(): Observable<SurgeryRoomDto[]> {
        let req: Observable<SurgeryRoomDto[]>;

        req = this.http.get<SurgeryRoomDto[]>(this.roomUrl);
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        );
    }

    getSurgeryRoom(code: string, name: string, description: string, forSurgery: boolean): Observable<SurgeryRoomDto[]> {
        let filters = new HttpParams();
        if (code != null && code != '') {
            filters = filters.set('code', code);
        }
        if (name != null && name != '') {
            filters = filters.set('name', name);
        }
        if (description != null && description != '') {
            filters = filters.set('description', description);
        }
        if (forSurgery != null) {
            filters = filters.set('forSurgery', forSurgery);
        }
        let req: Observable<SurgeryRoomDto[]>;
        req = this.http.get<SurgeryRoomDto[]>(this.roomUrl, { params: filters });
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }

    getSurgeryRoomByCode(id: string): Observable<SurgeryRoomDto> {
        return this.http.get<SurgeryRoomDto>(this.roomUrl + '/' + id);
    }

    createSurgeryRoom(surgeryRoom: SurgeryRoomDto): Observable<SurgeryRoomDto> {
        let req: Observable<SurgeryRoomDto>;
        req = this.http.post<SurgeryRoomDto>(this.roomUrl, surgeryRoom);
        return req.pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        );
    }
}
