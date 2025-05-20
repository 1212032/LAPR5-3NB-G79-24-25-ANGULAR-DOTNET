import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import MedicalRecordDTO from '../dto/MedicalRecordDTO';

@Injectable({
  providedIn: 'root',
})
export class MedicalRecordService {
  private baseUrl = environment.backend2Url + 'medicalRecords';
  constructor(private http: HttpClient) {}

  updateMedicalRecord(
    medicalRecordDTO: MedicalRecordDTO,
    id: string
  ): Observable<MedicalRecordDTO> {
    let req: Observable<MedicalRecordDTO>;
    req = this.http.put<MedicalRecordDTO>(
      this.baseUrl + '/' + id,
      medicalRecordDTO
    );
    return req.pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
  getMedicalRecord(id:string):Observable<MedicalRecordDTO>{
      let req: Observable<MedicalRecordDTO>;
      req = this.http.get<MedicalRecordDTO>(this.baseUrl+"/"+id);
      return req.pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
    }
}
