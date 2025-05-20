import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MedicalRecordService } from './medical-record.service';
import MedicalRecordDTO from '../dto/MedicalRecordDTO';
import { environment } from '../../../environments/environment.development';
import { HttpErrorResponse } from '@angular/common/http';

describe('MedicalRecordService', () => {
  let service: MedicalRecordService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.backend2Url + 'medicalRecords';
  const mockMedicalRecordDTO: MedicalRecordDTO = {
    id: '1',
    patientId: '1',
    allergies: [{ allergyId: '123', description: 'Peanuts' }],
    medicalConditions: [{ medicalConditionId: '456', description: 'Hypertension' }],
    freeTexts: ['Some free text'],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MedicalRecordService],
    });
    service = TestBed.inject(MedicalRecordService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ensure that there are no outstanding requests after each test
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should successfully update a medical record', () => {
    const updatedMedicalRecord = { ...mockMedicalRecordDTO, freeTexts: ['Updated free text'] };

    service.updateMedicalRecord(updatedMedicalRecord, '1').subscribe((response) => {
      expect(response).toEqual(updatedMedicalRecord);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedMedicalRecord);
    req.flush(updatedMedicalRecord);
  });

  it('should handle error when updating a medical record', () => {
    const updatedMedicalRecord = { ...mockMedicalRecordDTO, freeTexts: ['Updated free text'] };
    const errorMessage = 'Error updating medical record';

    service.updateMedicalRecord(updatedMedicalRecord, '1').subscribe(
      () => fail('expected an error'),
      (error) => {
        expect(error).toBeInstanceOf(HttpErrorResponse);
        expect(error.error.message).toBe(errorMessage);
      }
    );

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });
  });

  it('should successfully get a medical record by id', () => {
    service.getMedicalRecord('1').subscribe((response) => {
      expect(response).toEqual(mockMedicalRecordDTO);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMedicalRecordDTO);
  });

  it('should handle error when getting a medical record', () => {
    const errorMessage = 'Error fetching medical record';

    service.getMedicalRecord('1').subscribe(
      () => fail('expected an error'),
      (error) => {
        expect(error).toBeInstanceOf(HttpErrorResponse);
        expect(error.error.message).toBe(errorMessage);
      }
    );

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });
  });
});
