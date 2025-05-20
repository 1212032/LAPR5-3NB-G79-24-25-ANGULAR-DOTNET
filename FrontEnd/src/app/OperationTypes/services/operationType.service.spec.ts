import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OperationTypeService } from './operationType.service';
import { environment } from '../../../environments/environment.development';
import { SpecializationDto } from '../../Staff/dto/specializationDto';
import { CreatingOperationTypeDto } from '../dto/creatingOperationTypeDto';
import { UpdatingOperationTypeDto } from '../dto/updatingOperationTypeDto';
import { OperationTypeDto } from '../dto/operationTypeDto';

describe('OperationTypeService', () => {
    let service: OperationTypeService;
    let httpMock: HttpTestingController;
    const baseUrl = environment.apiUrl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [OperationTypeService]
        });
        service = TestBed.inject(OperationTypeService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should fetch all specializations', () => {
        const mockSpecializations: SpecializationDto[] = [
            { id: 1, name: 'Specialization 1' },
            { id: 2, name: 'Specialization 2' }
        ];

        service.getAllSpecializations().subscribe((specializations) => {
            expect(specializations.length).toBe(2);
            expect(specializations).toEqual(mockSpecializations);
        });

        const req = httpMock.expectOne(`${baseUrl}specializations`);
        expect(req.request.method).toBe('GET');
        req.flush(mockSpecializations);
    });

    it('should fetch all operation types', () => {
        const mockOperationTypes: OperationTypeDto[] = [
            { id: 1, name: 'Operation A', phases: [], active: true },
            { id: 2, name: 'Operation B', phases: [], active: false }
        ];

        service.getAllOperationTypes().subscribe((operationTypes) => {
            expect(operationTypes.length).toBe(2);
            expect(operationTypes).toEqual(mockOperationTypes);
        });

        const req = httpMock.expectOne(`${service.operationTypeUrl}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockOperationTypes);
    });

    it('should fetch operation types with filters', () => {
        const mockOperationTypes: OperationTypeDto[] = [
            { id: 1, name: 'Operation A', phases: [], active: true }
        ];

        service.getOperationTypes('Operation A', 1, true).subscribe((operationTypes) => {
            expect(operationTypes.length).toBe(1);
            expect(operationTypes).toEqual(mockOperationTypes);
        });

        const req = httpMock.expectOne(
            `${service.operationTypeUrl}?name=Operation%20A&specialization=1&active=true`
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockOperationTypes);
    });

    it('should fetch operation type by ID', () => {
        const mockOperationType: OperationTypeDto = {
            id: 1,
            name: 'Operation A',
            phases: [],
            active: true
        };

        service.getOperationTypeById(1).subscribe((operationType) => {
            expect(operationType).toEqual(mockOperationType);
        });

        const req = httpMock.expectOne(`${service.operationTypeUrl}/1`);
        expect(req.request.method).toBe('GET');
        req.flush(mockOperationType);
    });

    it('should create a new operation type', () => {
        const newOperationType: CreatingOperationTypeDto = {
            name: 'Operation A',
            phases: []
        };
        const mockResponse: OperationTypeDto = {
            id: 1,
            name: 'Operation A',
            phases: [],
            active: true
        };

        service.createOperationType(newOperationType).subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${service.operationTypeUrl}`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(newOperationType);
        req.flush(mockResponse);
    });

    it('should update an existing operation type', () => {
        const updatedOperationType: UpdatingOperationTypeDto = {
            id: 1,
            name: 'Updated Operation',
            phases: []
        };
        const mockResponse: OperationTypeDto = {
            id: 1,
            name: 'Updated Operation',
            phases: [],
            active: true
        };

        service.updateOperationType(updatedOperationType).subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${service.operationTypeUrl}/1`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(updatedOperationType);
        req.flush(mockResponse);
    });

    it('should inactivate an operation type', () => {
        const mockResponse: OperationTypeDto = {
            id: 1,
            name: 'Operation A',
            phases: [],
            active: false
        };

        service.inactivateOperationType(1).subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${service.operationTypeUrl}/1`);
        expect(req.request.method).toBe('DELETE');
        req.flush(mockResponse);
    });

    it('should handle HTTP errors', () => {
        const mockError = new ErrorEvent('Network error');

        service.getAllSpecializations().subscribe({
            next: () => fail('Should have failed with an error'),
            error: (error) => {
                expect(error).toBeTruthy();
            }
        });

        const req = httpMock.expectOne(`${baseUrl}specializations`);
        req.error(mockError);
    });
});
