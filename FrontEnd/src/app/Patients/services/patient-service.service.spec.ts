import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PatientService } from './patient.service';
import { PatientModel } from '../model/patientModel';
import { environment } from '../../../environments/environment.development';
import { HttpParams } from '@angular/common/http';

describe('PatientService', () => {
  let service: PatientService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}patients`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PatientService],
    });
    service = TestBed.inject(PatientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all patients', () => {
    const mockPatients: PatientModel[] = [
      {
        id: '1',
        firstName: 'Joao',
        lastName: 'Dias',
        gender: 'Man',
        dateOfBirth: new Date(2000, 1, 1),
        phone: '1234567890',
        email: 'email@email.com',
        emergencyContact: '912350134',
        medicalRecord: '123'
      },
      {
        id: '2',
        firstName: 'Dias',
        lastName: 'Brother',
        gender: 'Man',
        dateOfBirth: new Date(2000, 1, 1),
        phone: '1234522890',
        email: 'email@email.com',
        emergencyContact: '90134',
        medicalRecord: '123'
      },
    ];

    service.getAllPatients().subscribe((patients) => {
      expect(patients.length).toBe(2);
      expect(patients).toEqual(mockPatients);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockPatients);
  });

  it('should search patients with query parameters', () => {
    const queryParams = {
      name: 'Joao',  // Ensure consistent name
      email: 'email@email.com',
    };

    const mockPatients: PatientModel[] = [
      {
        firstName: 'Joao',
        lastName: 'Dias',
        gender: 'Man',
        dateOfBirth: new Date(2000, 1, 1),
        phone: '1234567890',
        email: 'email@email.com',
        emergencyContact: '912350134',
        id: '1',
        medicalRecord: '123'
      },
    ];

    let filters = new HttpParams();
    filters = filters.set('name', 'Joao');
    filters = filters.set('email', 'email@email.com')
    
    // Call the service method
    service.searchPatients(queryParams).subscribe((patients) => {
      expect(patients.length).toBe(1);
      expect(patients).toEqual(mockPatients);
    });

    // Expect the request to match the constructed URL
    const req = httpMock.expectOne(baseUrl + '/search?'+ filters.toString());
    expect(req.request.method).toBe('GET');
    req.flush(mockPatients);
  });

  it('should fetch a patient by ID', () => {
    const mockPatient: PatientModel = {
      firstName: 'Joao',
      lastName: 'Dias',
      gender: 'Man',
      dateOfBirth: new Date(2000, 1, 1),
      phone: '1234567890',
      email: 'email@email.com',
      emergencyContact: '912350134',
      id: '1',
      medicalRecord: '123'
    };

    service.getPatientById('1').subscribe((patient) => {
      expect(patient).toEqual(mockPatient);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPatient);
  });

  it('should create a new patient', () => {
    const newPatient: PatientModel = {
      firstName: 'Joao',
      lastName: 'Dias',
      gender: 'Man',
      dateOfBirth: new Date(2000, 1, 1),
      phone: '1234567890',
      email: 'email@email.com',
      emergencyContact: '912350134',
      id: '',
      medicalRecord: '123'
    };

    const mockResponse: PatientModel = {
      ...newPatient,
      id: '1',
    };

    service.createPatient(newPatient).subscribe((patient) => {
      expect(patient).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPatient);
    req.flush(mockResponse);
  });

  it('should update an existing patient', () => {
    const updatedPatient: PatientModel = {
      firstName: 'Joao',
      lastName: 'Dias',
      gender: 'Man',
      dateOfBirth: new Date(2000, 1, 1),
      phone: '1234567890',
      email: 'email@email.com',
      emergencyContact: '912350134',
      id: '1',
      medicalRecord: '123'
    };

    service.updatePatient('1', updatedPatient).subscribe((patient) => {
      expect(patient).toEqual(updatedPatient);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedPatient);
    req.flush(updatedPatient);
  });

  it('should delete a patient', () => {
    service.deletePatient('1').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

});
