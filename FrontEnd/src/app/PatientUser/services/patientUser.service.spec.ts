import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PatientUserService } from './patientUser.service';
import { environment } from '../../../environments/environment.development';
import { PatientDto } from '../dto/patientDto';
import { PatientRequestDto } from '../dto/patientRequestDto';
import { CreatePatientRequestDto } from '../dto/createPatientRequestDto';

describe('PatientUserService', () => {
    let service: PatientUserService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [PatientUserService],
        });
        service = TestBed.inject(PatientUserService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch patient data', () => {
        const mockPatient: PatientDto = {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '123456789',
            emergencyContact: 'Jane Doe',
            address: '123 Main St',
            dateOfBirth: new Date(1990, 1, 1),
            gender: 'Male',
            medicalRecord: 'MR123',
        };

        service.getPatient().subscribe((patient) => {
            expect(patient).toEqual(mockPatient);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}PatientRequests/patient`);
        expect(req.request.method).toBe('GET');
        req.flush(mockPatient);
    });

    it('should handle error when fetching patient data', () => {
        const mockError = {
            status: 404,
            statusText: 'Not Found',
        };

        service.getPatient().subscribe({
            next: () => fail('Should have failed with a 404 error'),
            error: (error) => {
                expect(error).toBeTruthy();
            },
        });

        const req = httpMock.expectOne(`${environment.apiUrl}PatientRequests/patient`);
        req.flush('Patient not found', mockError);
    });

    it('should send request', () => {
        const mockPatientRequest: CreatePatientRequestDto = {
            requestType: 'Update',
            firstName: 'John',
            lastName: 'Doe',
            emergencyContact: 'Jane Doe',
            phone: '123456789',
            address: '123 Main St',
            email: 'mail@mail.com'
        };

        const resPatientRequest: PatientRequestDto = {
            id: 1,
            requestType: 'Update',
            firstName: 'John',
            lastName: 'Doe',
            emergencyContact: 'Jane Doe',
            phone: '123456789',
            address: '123 Main St',
            email: 'mail@mail.com',
            requestedBy: '',
            requestDateTime: new Date(2025, 1, 1),
            requestDateTimeString: new Date(2025, 1, 1).toString()
        };

        service.sendPatientRequest(mockPatientRequest).subscribe((response) => {
            expect(response).toEqual(resPatientRequest);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}PatientRequests`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockPatientRequest);
        req.flush(resPatientRequest);
    });

    it('should handle error when requesting', () => {
        const mockError = {
            status: 500,
            statusText: 'Internal Server Error',
        };

        const mockPatientRequest: CreatePatientRequestDto = {
            requestType: 'Update',
            firstName: 'John',
            lastName: 'Doe',
            emergencyContact: 'Jane Doe',
            phone: '123456789',
            address: '123 Main St',
            email: 'mail@mail.com'
        };

        service.sendPatientRequest(mockPatientRequest).subscribe({
            next: () => fail('Should have failed with a 500 error'),
            error: (error) => {
                expect(error).toBeTruthy();
            },
        });

        const req = httpMock.expectOne(`${environment.apiUrl}PatientRequests`);
        req.flush('Update failed', mockError);
    });
});
