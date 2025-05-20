import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SpecializationService } from './specializations.service';
import { SpecializationsDto } from '../dto/specializationsDto';
import { CreatingSpecializationsDto } from '../dto/creatingSpecializationsDto';
import { environment } from '../../../environments/environment.development';
import { HttpErrorResponse } from '@angular/common/http';

describe('SpecializationService', () => {
  let service: SpecializationService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}specializations`;

  const mockSpecialization: SpecializationsDto = {
    id: 1,
    code: 'GEN',
    name: 'General Medicine',
    description: 'General medicine specialization',
  };

  const creatingSpecializationDto: CreatingSpecializationsDto = {
    code: 'GEN',
    name: 'General Medicine',
    description: 'General medicine specialization',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SpecializationService],
    });
    service = TestBed.inject(SpecializationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all specializations', () => {
    service.getAllSpecializations().subscribe((response) => {
      expect(response).toEqual([mockSpecialization]);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockSpecialization]);
  });

  it('should search specializations with query parameters', () => {
    const queryParams = { code: 'GEN', name: 'General Medicine' };
    const mockResponse: SpecializationsDto[] = [
      { id: 1, code: 'GEN', name: 'General Medicine', description: 'General medicine specialization' },
    ];
  
    service.searchSpecializations(queryParams).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
  
    const expectedUrl = `${baseUrl}/search?code=GEN&name=General%20Medicine`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
  

  it('should fetch a specialization by ID', () => {
    service.getSpecializationById(1).subscribe((response) => {
      expect(response).toEqual(mockSpecialization);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSpecialization);
  });

  it('should create a new specialization', () => {
    service.createSpecialization(creatingSpecializationDto).subscribe((response) => {
      expect(response).toEqual(mockSpecialization);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(creatingSpecializationDto);
    req.flush(mockSpecialization);
  });

  it('should update an existing specialization', () => {
    service.updateSpecialization(1, mockSpecialization).subscribe((response) => {
      expect(response).toEqual(mockSpecialization);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockSpecialization);
    req.flush(mockSpecialization);
  });

  it('should delete a specialization', () => {
    service.deleteSpecialization(1).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should handle HTTP errors', () => {
    const errorResponse = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
      error: { message: 'Invalid data' },
    });

    service.createSpecialization(creatingSpecializationDto).subscribe({
      next: () => fail('Expected an error, but got a success response'),
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.error.message).toBe('Invalid data');
      },
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Invalid data' }, { status: 400, statusText: 'Bad Request' });
  });
});
