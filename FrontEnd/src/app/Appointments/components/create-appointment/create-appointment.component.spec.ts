import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CreateAppointmentComponent } from './create-appointment.component';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentDto } from '../../dto/appointmentDto';
import { StaffService } from '../../../Staff/services/staff.service';
import { SurgeryRoomService } from '../../../SurgeryRooms/services/surgeryRoom.service';
import { OperationTypeService } from '../../../OperationTypes/services/operationType.service';
import { OperationRequestService } from '../../../OperationRequests/services/operationRequest.service';
import { OperationTypeDto } from '../../../OperationTypes/dto/operationTypeDto';
import { OperationRequestDto } from '../../../OperationRequests/dto/operationRequestDto';
import { CreatingAppointmentDto } from '../../dto/creatingAppointmentDto';
import { AppointmentPhaseDto } from '../../dto/appointmentPhaseDto';
import { HttpClientModule } from '@angular/common/http';


describe('CreateAppointmentComponent', () => {
    let component: CreateAppointmentComponent;
    let fixture: ComponentFixture<CreateAppointmentComponent>;
    let toastrService: jasmine.SpyObj<ToastrService>;
    let appointmentService: jasmine.SpyObj<AppointmentService>;
    let staffService: jasmine.SpyObj<StaffService>;
    let operationRequestService: jasmine.SpyObj<OperationRequestService>;
    let operationTypeService: jasmine.SpyObj<OperationTypeService>;
    let roomService: jasmine.SpyObj<SurgeryRoomService>;
    let router: jasmine.SpyObj<Router>;
    let mockActivatedRoute: any;

    beforeEach(async () => {
        toastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
        appointmentService = jasmine.createSpyObj('AppointmentService', ['createAppointment']);
        staffService = jasmine.createSpyObj('StaffService', ['getStaff']);
        roomService = jasmine.createSpyObj('SurgeryRoomService', ['getAllSurgeryRooms']);
        operationRequestService = jasmine.createSpyObj('OperationRequestService', ['getOperationRequestById']);
        operationTypeService = jasmine.createSpyObj('OperationTypeService', ['getOperationTypeById']);
        router = jasmine.createSpyObj('Router', ['navigate']);

        mockActivatedRoute = {
            params: of({ id: 1 })
        };

        await TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                FormBuilder,
                { provide: ToastrService, useValue: toastrService },
                { provide: AppointmentService, useValue: appointmentService },
                { provide: StaffService, useValue: staffService },
                { provide: OperationRequestService, useValue: operationRequestService },
                { provide: OperationTypeService, useValue: operationTypeService },
                { provide: SurgeryRoomService, useValue: roomService },
                { provide: Router, useValue: router },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CreateAppointmentComponent);
        component = fixture.componentInstance;

        // Mocking responses

        type slot = { item1: Date, item2: Date };
        let availabilitySlotsList: slot[] = [{
            item1: new Date(2024, 1, 1, 10, 0),
            item2: new Date(2024, 1, 1, 20, 0)
        }];
        staffService.getStaff.and.returnValue(of([
            {
                id: '1', firstName: '', lastName: '', fullName: '', active: true, licenseNumber: '',
                email: '', phone: '', role: 'Doctor', availabilitySlots: availabilitySlotsList, specialization: 1
            }
        ]));

        roomService.getAllSurgeryRooms.and.returnValue(of([
            { id: '1', code: '12345678', name: '', description: '', forSurgery: true }
        ]));

        operationRequestService.getOperationRequestById.and.returnValue(of({
            id: 1,
            status: 'Pending',
            deadlineDate: "2024-01-01",
            priority: 'Elective',
            operationType: 1,
            patientMedicalRecordNumber: '1'
        } as OperationRequestDto));

        operationTypeService.getOperationTypeById.and.returnValue(of({
            id: 1,
            name: 'Operation type',
            phases: [
                { name: 'Preparation', duration: 10, specializations: { 1: 1 } },
                { name: 'Surgery', duration: 10, specializations: { 1: 1 } },
                { name: 'Cleaning', duration: 10, specializations: { 1: 1 } }
            ],
            active: true
        } as OperationTypeDto));

        fixture.detectChanges();

        await component.ngOnInit();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form on ngOnInit', async () => {
        expect(component.appointmentForm).toBeDefined();
        expect(component.operationRequestId).toBe(1);
        expect(component.appointmentForm.get('dateTime')).toBeTruthy();
        expect(component.appointmentForm.get('room')).toBeTruthy();
        expect(component.phases.length).toBe(3);
    });

    it('should fetch staff on ngOnInit', () => {
        expect(component.staffList?.length).toBe(1);
        expect(staffService.getStaff).toHaveBeenCalled();
    });

    it('should fetch rooms on ngOnInit', () => {
        expect(component.rooms?.length).toBe(1);
        expect(roomService.getAllSurgeryRooms).toHaveBeenCalled();
    });

    it('should fetch operation request on ngOnInit', async () => {
        expect(component.operationRequestId).toBe(1);
        expect(operationRequestService.getOperationRequestById).toHaveBeenCalledWith(1);
    });

    it('should fetch operation type on ngOnInit', async () => {
        expect(operationTypeService.getOperationTypeById).toHaveBeenCalledWith(1);
    });

    it('should create appointment dto', () => {
        let phasesFormArray: FormArray = new FormBuilder().array([])
        phasesFormArray.push(new FormGroup({
            'name': new FormControl('A', Validators.required),
            'staffs': new FormArray([])
        }));
        phasesFormArray.push(new FormGroup({
            'name': new FormControl('B', Validators.required),
            'staffs': new FormArray([])
        }));
        phasesFormArray.push(new FormGroup({
            'name': new FormControl('C', Validators.required),
            'staffs': new FormArray([])
        }));
        (phasesFormArray.at(0).get('staffs') as FormArray).push(new FormGroup({
            'specialization': new FormControl('1')
        }));
        (phasesFormArray.at(1).get('staffs') as FormArray).push(new FormGroup({
            'specialization': new FormControl('1')
        }));
        (phasesFormArray.at(2).get('staffs') as FormArray).push(new FormGroup({
            'specialization': new FormControl('1')
        }));
        component.appointmentForm.controls['dateTime'].setValue(new Date(2024, 1, 1, 10, 0));
        component.appointmentForm.controls['room'].setValue('12345678');
        component.staffIds = [];
        for (let i = 0; i < 3; i++) {
            let phaseStaffIds: string[] = [];
            component.staffIds.push({ staff: phaseStaffIds });
            phaseStaffIds.push('1');
        }

        const dto: CreatingAppointmentDto = component.createDTO();

        let phasesDto: AppointmentPhaseDto[] = [];
        let staffIds1: string[] = [];
        phasesDto.push({ staff: staffIds1 });
        staffIds1.push('1');
        let staffIds2: string[] = [];
        phasesDto.push({ staff: staffIds2 });
        staffIds2.push('1');
        let staffIds3: string[] = [];
        phasesDto.push({ staff: staffIds3 });
        staffIds3.push('1');
        const expected: CreatingAppointmentDto = {
            dateTime: new Date(2024, 1, 1, 10, 0),
            originatingOperationRequest: 1,
            room: '12345678',
            phases: phasesDto
        }
        expect(dto).toEqual(expected);
    });

    it('should show success message when appointment is created successfully', () => {
        let appointmentDto: AppointmentDto = {
            status: 'scheduled',
            id: 1,
            dateTime: new Date(2024, 1, 1),
            originatingOperationRequest: 1,
            room: '12345678',
            phases: [],
            patientId: '1',
            patientFullName: 'Full name',
            surgeryRoomName: 'Room name'
        }
        appointmentService.createAppointment.and.returnValue(of(appointmentDto));
        component.createAppointment();
        expect(toastrService.success).toHaveBeenCalledWith('Appointment created successfully', 'Success');
    });

    it('should show error message when creation fails', () => {
        appointmentService.createAppointment.and.returnValue(throwError({ error: { message: 'Error message' } }));
        component.createAppointment();
        expect(toastrService.error).toHaveBeenCalledWith('Failed to create appointment\nError message', 'Error');
    });
});