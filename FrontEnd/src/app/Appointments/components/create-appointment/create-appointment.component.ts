import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { StaffService } from '../../../Staff/services/staff.service';
import { OperationRequestService } from '../../../OperationRequests/services/operationRequest.service';
import { OperationTypeService } from '../../../OperationTypes/services/operationType.service';
import { SurgeryRoomService } from '../../../SurgeryRooms/services/surgeryRoom.service';
import { CommonModule } from '@angular/common';
import { CreatingAppointmentDto } from '../../dto/creatingAppointmentDto';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffDto } from '../../../Staff/dto/staffDto';
import { OperationRequestDto } from '../../../OperationRequests/dto/operationRequestDto';
import { OperationTypeDto } from '../../../OperationTypes/dto/operationTypeDto';
import { SurgeryRoomDto } from '../../../SurgeryRooms/dto/surgeryRoomDto';
import { AppointmentPhaseDto } from '../../dto/appointmentPhaseDto';
import { PatientService } from '../../../Patients/services/patient.service';
import { PatientModel } from '../../../Patients/model/patientModel';

@Component({
    selector: 'app-create-appointment',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './create-appointment.component.html',
    styleUrl: './create-appointment.component.css'
})
export class CreateAppointmentComponent implements OnInit {
    appointmentForm!: FormGroup;
    appointment?: CreatingAppointmentDto;
    rooms: SurgeryRoomDto[];
    staffList: StaffDto[]; //list of all active staff
    operationRequestId: number;
    staffIds: AppointmentPhaseDto[] = [];
    operationRequestDeadline: string = '';
    operationRequestPriority: string = '';
    patientId: string = '';
    patientName: string = '';

    constructor(private fb: FormBuilder, private appointmentService: AppointmentService, private patientService: PatientService,
        private staffService: StaffService, private operationRequestService: OperationRequestService,
        private operationTypeService: OperationTypeService, private toastr: ToastrService,
        private roomService: SurgeryRoomService, private route: ActivatedRoute, private router: Router) {
        this.operationRequestId = 0;
        this.rooms = [];
        this.staffList = [];
    }

    async ngOnInit(): Promise<void> {
        this.appointmentForm = this.fb.group({
            room: ['', Validators.required],
            dateTime: ['', Validators.required],
            phases: this.fb.array([])
        })
        await this.getAllRooms();
        await this.getAllActiveStaff();
        this.route.params.subscribe(params => {
            this.operationRequestId = params['id'];
            this.getOperationRequest();
        });
    }

    get phases() {
        return this.appointmentForm.get('phases') as FormArray;
    }

    changeStaff(i: number, j: number, e: any) {
        this.staffIds[i].staff[j] = e.target.value;
    }

    async getOperationRequest() {
        this.operationRequestService.getOperationRequestById(this.operationRequestId).subscribe({
            next: (resultOperationRequest: OperationRequestDto | null) => {
                if (resultOperationRequest != null) {
                    if (resultOperationRequest.status.toLowerCase() === 'pending') {
                        this.operationRequestDeadline = resultOperationRequest.deadlineDate.toString().substring(0, 10);
                        this.operationRequestPriority = resultOperationRequest.priority;
                        this.getOperationType(resultOperationRequest.operationType);
                        this.getPatient(resultOperationRequest.patientMedicalRecordNumber);
                    } else {
                        this.toastr.error('Operation request is not pending', 'Error');
                        this.sendToSearch();
                    }
                } else {
                    this.toastr.error('Operation request not found', 'Error');
                    this.sendToSearch();
                }
            },
            error: (err: HttpErrorResponse) => {
                this.toastr.error('Operation request not found', 'Error');
                this.sendToSearch();
            }
        });
    }

    async getPatient(patientId: string) {
        this.patientService.getPatientById(patientId).subscribe({
            next: (resultPatient: PatientModel) => {
                this.patientId = resultPatient.id;
                this.patientName = resultPatient.firstName + " " + resultPatient.lastName;
            },
            error: (err) => {
                this.toastr.error('Failed to fetch patient data.\n' + err, 'Error');
            }
        });
    }

    async getOperationType(operationTypeId: number) {
        this.operationTypeService.getOperationTypeById(operationTypeId).subscribe({
            next: (resultOperationType: OperationTypeDto | null) => {
                if (resultOperationType != null) {
                    let phases = this.appointmentForm.get('phases') as FormArray;
                    while (phases.length !== 0) {
                        phases.removeAt(0)
                    }
                    for (let i = 0; i < resultOperationType.phases.length && i < 3; i++) {
                        phases.push(new FormGroup({
                            'name': new FormControl(resultOperationType.phases[i].name, Validators.required),
                            'staffs': new FormArray([])
                        }));

                        let phaseStaffIds: string[] = [];
                        this.staffIds.push({ staff: phaseStaffIds });

                        let staffs = phases.at(i).get('staffs') as FormArray;
                        let specializationsMap: { [key: number]: number } = resultOperationType.phases[i].specializations;
                        for (let j = 0; j < Object.keys(specializationsMap).length; j++) {
                            let [key, value] = Object.entries(specializationsMap)[j];
                            for (let v = 0; v < value; v++) {
                                staffs.push(new FormGroup({
                                    'specialization': new FormControl(key)
                                }));
                                phaseStaffIds.push('');
                            }
                        }
                    }
                } else {
                    this.toastr.error('Operation type not found', 'Error');
                    this.sendToSearch();
                }
            },
            error: (err: HttpErrorResponse) => {
                this.toastr.error('Operation type not found', 'Error');
                this.sendToSearch();
            }
        });
    }

    async getAllActiveStaff() {
        if (this.staffList == null || this.staffList.length === 0) {
            this.staffService.getStaff('', '', '', 0, true).subscribe({
                next: (resultStaff: StaffDto[] | null) => {
                    if (resultStaff != null) {
                        this.staffList = resultStaff;
                    }
                }
            });
        }
    }

    async getAllRooms() {
        if (this.rooms == null || this.rooms.length === 0) {
            this.roomService.getAllSurgeryRooms().subscribe({
                next: (resultRooms: SurgeryRoomDto[] | null) => {
                    if (resultRooms != null) {
                        this.rooms = resultRooms;
                    }
                }
            });
        }
    }

    createDTO() {
        const CreatingAppointmentDto = {
            dateTime: this.appointmentForm.value.dateTime,
            originatingOperationRequest: this.operationRequestId,
            room: this.appointmentForm.value.room,
            phases: this.staffIds,
        }
        return CreatingAppointmentDto;
    }

    createAppointment() {
        this.appointment = this.createDTO();

        if (this.appointment == null)
            return alert("Appointment invalid, unexpected error!");

        this.appointmentService.createAppointment(this.appointment).subscribe({
            next: () => {
                this.toastr.success('Appointment created successfully', 'Success');
                this.sendToSearch();
            },
            error: (err: HttpErrorResponse) => {
                this.toastr.error('Failed to create appointment\n' + err.error.message, 'Error');
            }
        })
    }

    sendToSearch() {
        this.router.navigate(['/doctor/appointment/search']);
    }
}