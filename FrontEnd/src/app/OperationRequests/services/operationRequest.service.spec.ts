import { TestBed } from '@angular/core/testing';

import { OperationRequestService } from './operationRequest.service';
import { HttpParams, provideHttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment.development';
import { OperationTypeDto } from '../../OperationTypes/dto/operationTypeDto';
import { PatientDto } from '../../Patients/dto/patientDto';
import { CreatingOperationRequestDto } from '../dto/creatingOperationRequestDto';
import { OperationRequestDto } from '../dto/operationRequestDto';
describe('OperationRequestService', () => {
  let service: OperationRequestService;
  let httpMock: HttpTestingController;
  const baseurl = environment.apiUrl;
  const operationRequestsUrl = environment.apiUrl + 'OperationRequests'

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OperationRequestService, provideHttpClientTesting()]
    });
    service = TestBed.inject(OperationRequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    httpMock.expectNone({});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all operation types', () => {
    const dummyOperationTypes: OperationTypeDto[] = [
      {
        id: 1, name: 'Type1',
        active: false,
        phases: []
      },
      {
        id: 2, name: 'Type2',
        active: false,
        phases: []
      }
    ];

    service.getAllOperationTypes().subscribe(operationTypes => {
      expect(operationTypes.length).toBe(2);
      expect(operationTypes).toEqual(dummyOperationTypes);
    });

    const req = httpMock.expectOne(baseurl + 'operationTypes');
    expect(req.request.method).toBe('GET');
    req.flush(dummyOperationTypes);
  });

  it('should fetch all patients', () => {
    const dummyPatients: PatientDto[] = [
      {
        id: '1',
        firstName: 'Patient',
        lastName: '1',
        fullName: 'Patient 1',
        medicalRecord: 'MR1',
        emergencyContact: '987',
        gender: 'Man',
        dateOfBirth: '1998-12-02',
        email: 'email1@email.com',
        phone: '12345',
        address: 'rua do'
      },
      {
        id: '2',
        firstName: 'Patient',
        lastName: '2',
        fullName: 'Patient 2',
        medicalRecord: 'MR2',
        emergencyContact: '987',
        gender: 'Man',
        dateOfBirth: '1998-12-02',
        email: 'email2@email.com',
        phone: '12345',
        address: 'rua do'
      }
    ];

    service.getAllPatients().subscribe(patients => {
      expect(patients.length).toBe(2);
      expect(patients).toEqual(dummyPatients);
    });

    const req = httpMock.expectOne(baseurl + 'patients');
    expect(req.request.method).toBe('GET');
    req.flush(dummyPatients);
  });

  it('should fetch operation request by id', () => {
    const dummyOperationRequest: OperationRequestDto = {
      id: 1,
      deadlineDate: '2024-12-01',
      priority: 'Urgent',
      operationType: 1,
      patientMedicalRecordNumber: 'MR1',
      status: ''
    };

    service.getOperationRequestById(1).subscribe(operationRequest => {
      expect(operationRequest).toEqual(dummyOperationRequest);
    });

    const req = httpMock.expectOne(operationRequestsUrl + '/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyOperationRequest);
  });

  it('should create a new operation request', () => {
    const newOperationRequest: CreatingOperationRequestDto = {
      deadlineDate: '2024-12-01',
      priority: 'Urgent',
      operationType: 1,
      patientMedicalRecordNumber: 'MR1'
    };
    const createdOperationRequest: OperationRequestDto = { id: 1, status: '', ...newOperationRequest };

    service.createOperationRequest(newOperationRequest).subscribe(operationRequest => {
      expect(operationRequest).toEqual(createdOperationRequest);
    });

    const req = httpMock.expectOne(operationRequestsUrl);
    expect(req.request.method).toBe('POST');
    req.flush(createdOperationRequest);
  });

  it('should update an operation request', () => {

    const updatedOperationRequest: OperationRequestDto = {
      id: 1,
      deadlineDate: '01/02/2023',
      priority: 'Urgent',
      operationType: 1,
      patientMedicalRecordNumber: '1',
      status: ''
    };

    service.updateOperationRequest(updatedOperationRequest).subscribe(operationRequest => {
      expect(operationRequest).toEqual(updatedOperationRequest);
    });

    const req = httpMock.expectOne(operationRequestsUrl + '/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedOperationRequest);
  });

  it('should delete an operation request', () => {
    const dummyOperationRequest: OperationRequestDto = {
      id: 1,
      deadlineDate: '01/02/2023',
      priority: 'Urgent',
      operationType: 1,
      patientMedicalRecordNumber: '1',
      status: ''
    };
    service.removeOperationRequest(1).subscribe(operationRequest => {
      expect(operationRequest).toEqual(dummyOperationRequest);
    });

    const req = httpMock.expectOne(operationRequestsUrl + '/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyOperationRequest);
  });

  it('should search operation requests with filters', () => {
    const dummyOperationRequests: OperationRequestDto[] = [
      {
        id: 1,
        deadlineDate: '01/02/2023',
        priority: 'Urgent',
        operationType: 1,
        patientMedicalRecordNumber: '1',
        status: ''
      }, {
        id: 1,
        deadlineDate: '01/02/2023',
        priority: 'Elective',
        operationType: 1,
        patientMedicalRecordNumber: '1',
        status: ''
      }
    ];

    const startDate = new Date(2024, 11, 21, 11, 42, 59, 38);
    const endDate = new Date(2024, 11, 21, 11, 42, 59, 38);

    let filters = new HttpParams();
    filters = filters.set('priority', 'Urgent');
    filters = filters.set('operationType', 1);
    filters = filters.set('patientName', 'Patient 1');
    filters = filters.set('patientMedicalRecordNumber', 'MR1');
    filters = filters.set('startDate', startDate.toISOString());
    filters = filters.set('endDate', endDate.toISOString());

    service.searchOperationRequestWithFilters('Urgent', 1, 'Patient 1', 'MR1', startDate, endDate).subscribe(operationRequests => {
      expect(operationRequests.length).toBe(2);
      expect(operationRequests).toEqual(dummyOperationRequests);
    });


    const req = httpMock.expectOne(operationRequestsUrl + '/filter?' + filters.toString());

    expect(req.request.method).toBe('GET');
    req.flush(dummyOperationRequests);
  });
});
