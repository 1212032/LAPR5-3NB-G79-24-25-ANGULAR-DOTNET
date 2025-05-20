import { TestBed } from '@angular/core/testing';
import { AllergyService } from './allergy.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AllergyDto } from '../dto/allergyDto';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CreatingAllergyDto } from '../dto/creatingAllergyDto';

describe('AllergyService', () => {
    let service: AllergyService;
    let httpMock: HttpTestingController;

    const mockBaseUrl = environment.backend2Url + 'allergies';
    const mockAllergy: AllergyDto = {
        id: '1',
        code: 'A123',
        name: 'Allergy A',
        description: 'Test description',
    };

    const creatingAllergyDto: CreatingAllergyDto = {
        code: 'A123',
        name: 'Allergy A',
        description: 'Test description',
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AllergyService]
        });
        service = TestBed.inject(AllergyService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should create a new allergy', () => {
        service.createAllergy(creatingAllergyDto).subscribe((response) => {
            expect(response).toEqual(mockAllergy);
        });

        const req = httpMock.expectOne(mockBaseUrl);
        expect(req.request.method).toBe('POST');
        req.flush(mockAllergy);
    });

    it('should update allergy', () => {
        service.updateAllergy(mockAllergy).subscribe((response) => {
            expect(response).toEqual(mockAllergy);
        });

        const req = httpMock.expectOne(mockBaseUrl + "/1");
        expect(req.request.method).toBe('PUT');
        req.flush(mockAllergy);
    });

    it('should handle HTTP errors', () => {
        const errorResponse = new HttpErrorResponse({
            status: 400,
            statusText: 'Bad Request',
            error: { message: 'Invalid data' },
        });

        service.createAllergy(creatingAllergyDto).subscribe({
            next: () => fail('Expected an error, but got a success response'),
            error: (error) => {
                expect(error.status).toBe(400);
                expect(error.error.message).toBe('Invalid data');
            },
        });

        const req = httpMock.expectOne(mockBaseUrl);
        expect(req.request.method).toBe('POST');
        req.flush({ message: 'Invalid data' }, { status: 400, statusText: 'Bad Request' });
    });

    it('should get allergy', () => {
        service.getAllAllergies().subscribe((response) => {
            expect(response).toEqual([mockAllergy]);
        });

        const req = httpMock.expectOne(`${mockBaseUrl}`);
        expect(req.request.method).toBe('GET');
        req.flush([mockAllergy]);
    });
});