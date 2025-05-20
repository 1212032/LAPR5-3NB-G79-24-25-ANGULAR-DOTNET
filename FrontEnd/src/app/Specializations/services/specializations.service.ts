import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, retry, throwError, Observable } from 'rxjs';
import { SpecializationsDto } from '../dto/specializationsDto';
import { CreatingSpecializationsDto } from '../dto/creatingSpecializationsDto';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SpecializationService {
  private readonly baseUrl = `${environment.apiUrl}specializations`;

  constructor(private http: HttpClient) {}

  /**
   * Create a new specialization.
   */
  createSpecialization(dto: CreatingSpecializationsDto): Observable<SpecializationsDto> {
    return this.http.post<SpecializationsDto>(this.baseUrl, dto).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Get all specializations.
   */
  getAllSpecializations(): Observable<SpecializationsDto[]> {
    return this.http.get<SpecializationsDto[]>(this.baseUrl).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Search for specializations with optional query parameters.
   */
  searchSpecializations(queryParams: { code?: string; name?: string; description?: string }): Observable<SpecializationsDto[]> {
    let params = new HttpParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) {
        params = params.set(key, value);
      }
    });

    return this.http.get<SpecializationsDto[]>(`${this.baseUrl}/search`, { params }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Get specialization by ID.
   */
  getSpecializationById(id: number): Observable<SpecializationsDto> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<SpecializationsDto>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update an existing specialization.
   */
  updateSpecialization(id: number, specialization: SpecializationsDto): Observable<SpecializationsDto> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<SpecializationsDto>(url, specialization).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete a specialization by ID.
   */
  deleteSpecialization(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      return throwError(() => new Error(`Client Error: ${error.error.message}`));
    } else {
      // Server-side errors
      return throwError(() => new Error(`Server Error: ${error.status}, Message: ${error.message}`));
    }
  }
}
