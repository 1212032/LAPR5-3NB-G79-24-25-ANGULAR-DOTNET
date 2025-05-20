import { TestBed } from '@angular/core/testing';
import { StaffService } from './staff.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment.development';
import { SpecializationDto } from '../dto/specializationDto';
import { StaffDto } from '../dto/staffDto';
import { CreatingStaffDto } from '../dto/creatingStaffDto';
import { UpdatingStaffDto } from '../dto/updatingStaffDto';
import { HttpParams } from '@angular/common/http';

describe('StaffService', () => {
    let service: StaffService;
    let httpMock: HttpTestingController;
    const baseUrl = environment.apiUrl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [StaffService]
        });
        service = TestBed.inject(StaffService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should fetch all specializations', () => {
        const mockSpecializations: SpecializationDto[] = [
            { id: 1, name: 'Cardiology' },
            { id: 2, name: 'Neurology' }
        ];

        service.getAllSpecializations().subscribe((specializations) => {
            expect(specializations.length).toBe(2);
            expect(specializations).toEqual(mockSpecializations);
        });

        const req = httpMock.expectOne(`${baseUrl}specializations`);
        expect(req.request.method).toBe('GET');
        req.flush(mockSpecializations);
    });

    it('should fetch all staff', () => {
        const mockStaff: StaffDto[] = [
            {
                id: '1',
                fullName: 'Joao Dias',
                role: 'Doctor',
                active: true,
                licenseNumber: '12345',
                email: 'email@email.com',
                phone: '912345634',
                firstName: 'Joao',
                lastName: 'Dias',
                availabilitySlots: [],
                specialization: 1
            },
            {
                id: '2',
                fullName: 'Andreia Sofia',
                role: 'Doctor',
                active: true,
                licenseNumber: '12345',
                email: 'email@email.com',
                phone: '912345634',
                firstName: 'Andreia',
                lastName: 'Sofia',
                availabilitySlots: [],
                specialization: 1
            }
        ];

        service.getAllStaff().subscribe((staff) => {
            expect(staff.length).toBe(2);
            expect(staff).toEqual(mockStaff);
        });

        const req = httpMock.expectOne(`${baseUrl}Staff`);
        expect(req.request.method).toBe('GET');
        req.flush(mockStaff);
    });

    it('should fetch staff by filters', () => {
        const mockStaff: StaffDto[] = [{
            id: '1',
            fullName: 'Joao Dias',
            role: 'Doctor',
            active: true,
            licenseNumber: '12345',
            email: 'email@email.com',
            phone: '912345634',
            firstName: 'Joao',
            lastName: 'Dias',
            availabilitySlots: [],
            specialization: 1
        }];

        service.getStaff('12345', 'Joao', 'Doctor', 1, true).subscribe((staff) => {
            expect(staff.length).toBe(1);
            expect(staff).toEqual(mockStaff);
        });
        let filters = new HttpParams();
        filters = filters.set('licenseNumber', '12345');
        filters = filters.set('name', 'Joao');
        filters = filters.set('role', 'Doctor');
        filters = filters.set('specialization', 1);
        filters = filters.set('active', true);

        const req = httpMock.expectOne(
            `${baseUrl}Staff?${filters}`
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockStaff);
    });

    it('should fetch staff by ID', () => {
        const mockStaff: StaffDto = {
            id: '1',
            fullName: 'Joao Dias',
            role: 'Doctor',
            active: true,
            licenseNumber: '98765',
            email: 'email@email.com',
            phone: '912345634',
            firstName: 'Joao',
            lastName: 'Dias',
            availabilitySlots: [],
            specialization: 1
        };

        service.getStaffById('1').subscribe((staff) => {
            expect(staff).toEqual(mockStaff);
        });

        const req = httpMock.expectOne(`${baseUrl}Staff/1`);
        expect(req.request.method).toBe('GET');
        req.flush(mockStaff);
    });

    it('should create a new staff member', () => {
        const newStaff: CreatingStaffDto = {
            role: 'Doctor',
            licenseNumber: '98765',
            email: 'email@email.com',
            phone: '912345634',
            firstName: 'Jose',
            lastName: 'Miguel',
            availabilitySlots: [],
            specialization: 1
        };
        const mockResponse: StaffDto = {
            id: '3',
            fullName: 'Dr. Jane Doe',
            role: 'Doctor',
            active: true,
            email: 'email@email.com',
            phone: '912345634',
            firstName: 'Jose',
            lastName: 'Miguel',
            availabilitySlots: [],
            specialization: 1,
            licenseNumber: '98765'
        };

        service.createStaff(newStaff).subscribe((staff) => {
            expect(staff).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${baseUrl}Staff`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(newStaff);
        req.flush(mockResponse);
    });

    it('should update an existing staff member', () => {
        const updatedStaff: UpdatingStaffDto = {
            id: '1',
            role: 'Doctor',
            specialization: 1,
            licenseNumber: '12345',
            email: 'email@email.com',
            phone: '912345634',
            firstName: 'Jose',
            lastName: 'Miguel',
            availabilitySlots: [],
        };
        const mockResponse: StaffDto = {
            id: '1',
            fullName: 'Dr. John Updated',
            role: 'Doctor',
            active: true,
            licenseNumber: '12345',
            email: 'email@email.com',
            phone: '912345634',
            firstName: 'Jose',
            lastName: 'Miguel',
            availabilitySlots: [],
            specialization: 1
        };

        service.updateStaff(updatedStaff).subscribe((staff) => {
            expect(staff).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${baseUrl}Staff/1`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(updatedStaff);
        req.flush(mockResponse);
    });

    it('should inactivate a staff member', () => {
        const mockResponse: StaffDto = {
            id: '1',
            fullName: 'Dr. John Doe',
            role: 'Doctor',
            active: false,
            licenseNumber: '1234',
            email: 'email@email.com',
            phone: '912345634',
            firstName: 'Jose',
            lastName: 'Miguel',
            availabilitySlots: [],
            specialization: 1
        };

        service.inactivateStaff('1').subscribe((staff) => {
            expect(staff).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${baseUrl}Staff/1`);
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
