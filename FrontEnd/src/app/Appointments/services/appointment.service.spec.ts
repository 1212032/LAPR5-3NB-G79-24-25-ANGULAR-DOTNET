import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppointmentService } from './appointment.service';
import { environment } from '../../../environments/environment.development';
import { OperationTypeService } from '../../OperationTypes/services/operationType.service';
import { SurgeryRoomService } from '../../SurgeryRooms/services/surgeryRoom.service';
import { StaffService } from '../../Staff/services/staff.service';
import { OperationRequestService } from '../../OperationRequests/services/operationRequest.service';
import { SurgeryRoomDto } from '../../SurgeryRooms/dto/surgeryRoomDto';
import { StaffDto } from '../../Staff/dto/staffDto';
import { OperationRequestDto } from '../../OperationRequests/dto/operationRequestDto';
import { OperationTypeDto } from '../../OperationTypes/dto/operationTypeDto';
import { AppointmentDto } from '../dto/appointmentDto';
import { CreatingAppointmentDto } from '../dto/creatingAppointmentDto';
import { UpdatingAppointmentDto } from '../dto/updatingAppointmentDto';

describe('OperationTypeService', () => {
    let appointmentService: AppointmentService;
    let operationTypeService: OperationTypeService;
    let operationRequestService: OperationRequestService;
    let staffService: StaffService;
    let surgeryRoomService: SurgeryRoomService;
    let httpMock: HttpTestingController;
    const baseUrl = environment.apiUrl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [OperationTypeService, OperationRequestService, StaffService, SurgeryRoomService, AppointmentService]
        });
        appointmentService = TestBed.inject(AppointmentService);
        operationTypeService = TestBed.inject(OperationTypeService);
        operationRequestService = TestBed.inject(OperationRequestService);
        staffService = TestBed.inject(StaffService);
        surgeryRoomService = TestBed.inject(SurgeryRoomService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should fetch all rooms', () => {
        const mockRooms: SurgeryRoomDto[] = [
            { code: '12345678', name: '1', description: '1', forSurgery: true },
            { code: '87654321', name: '2', description: '2', forSurgery: true }
        ];

        surgeryRoomService.getAllSurgeryRooms().subscribe((rooms) => {
            expect(rooms.length).toBe(2);
            expect(rooms).toEqual(mockRooms);
        });

        const req = httpMock.expectOne(`${baseUrl}SurgeryRoom`);
        expect(req.request.method).toBe('GET');
        req.flush(mockRooms);
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

        staffService.getStaff('', '', '', 0, true).subscribe((staff) => {
            expect(staff.length).toBe(2);
            expect(staff).toEqual(mockStaff);
        });

        const req = httpMock.expectOne(`${baseUrl}Staff?active=true`);
        expect(req.request.method).toBe('GET');
        req.flush(mockStaff);
    });

    it('should fetch operation request by id', () => {
        const dummyOperationRequest: OperationRequestDto = {
            id: 1,
            deadlineDate: '2024-01-01',
            priority: 'Urgent',
            operationType: 1,
            patientMedicalRecordNumber: '1',
            status: 'Pending'
        };

        operationRequestService.getOperationRequestById(1).subscribe(operationRequest => {
            expect(operationRequest).toEqual(dummyOperationRequest);
        });

        const req = httpMock.expectOne(`${baseUrl}OperationRequests/1`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyOperationRequest);
    });

    it('should fetch operation type by ID', () => {
        const mockOperationType: OperationTypeDto = {
            id: 1,
            name: 'Operation Type',
            phases: [],
            active: true
        };

        operationTypeService.getOperationTypeById(1).subscribe((operationType) => {
            expect(operationType).toEqual(mockOperationType);
        });

        const req = httpMock.expectOne(`${baseUrl}OperationTypes/1`);
        expect(req.request.method).toBe('GET');
        req.flush(mockOperationType);
    });

    it('should create a new appointment', () => {
        const newAppointment: CreatingAppointmentDto = {
            dateTime: new Date(2024, 1, 1),
            originatingOperationRequest: 1,
            room: '12345678',
            phases: []
        };

        const mockResponse: AppointmentDto = {
            id: 1,
            dateTime: new Date(2024, 1, 1),
            originatingOperationRequest: 1,
            room: '12345678',
            status: 'scheduled',
            phases: [],
            patientId: '1',
            patientFullName: 'Full name',
            surgeryRoomName: 'Room name'
        };

        appointmentService.createAppointment(newAppointment).subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${baseUrl}Appointments`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(newAppointment);
        req.flush(mockResponse);
    });

    it('should update an appointment', () => {
        const updateAppointment: UpdatingAppointmentDto = {
            id: 1,
            dateTime: new Date(2024, 1, 1),
            originatingOperationRequest: 1,
            room: '12345678',
            phases: []
        };

        const mockResponse: AppointmentDto = {
            id: 1,
            dateTime: new Date(2024, 1, 1),
            originatingOperationRequest: 1,
            room: '12345678',
            status: 'scheduled',
            phases: [],
            patientId: '1',
            patientFullName: 'Full name',
            surgeryRoomName: 'Room name'
        };

        appointmentService.updateAppointment(updateAppointment).subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${baseUrl}Appointments/1`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(updateAppointment);
        req.flush(mockResponse);
    });
});