import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { StaffService } from '../../../Staff/services/staff.service';
import { OperationRequestService } from '../../../OperationRequests/services/operationRequest.service';
import { OperationTypeService } from '../../../OperationTypes/services/operationType.service';
import { SurgeryRoomService } from '../../../SurgeryRooms/services/surgeryRoom.service';
import { CommonModule } from '@angular/common';
import { AppointmentDto } from '../../dto/appointmentDto';
import { UpdatingAppointmentDto } from '../../dto/updatingAppointmentDto';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffDto } from '../../../Staff/dto/staffDto';
import { OperationRequestDto } from '../../../OperationRequests/dto/operationRequestDto';
import { OperationTypeDto } from '../../../OperationTypes/dto/operationTypeDto';
import { SurgeryRoomDto } from '../../../SurgeryRooms/dto/surgeryRoomDto';
import { AppointmentPhaseDto } from '../../dto/appointmentPhaseDto';
import { PatientDto } from '../../../PatientUser/dto/patientDto';
import { PatientService } from '../../../Patients/services/patient.service';
import { PatientModel } from '../../../Patients/model/patientModel';

@Component({
    selector: 'app-update-appointment',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './update-appointment.component.html',
    styleUrl: './update-appointment.component.css'
})
export class UpdateAppointmentComponent implements OnInit {
    appointmentForm!: FormGroup;
    appointment?: UpdatingAppointmentDto;
    rooms: SurgeryRoomDto[] = [];
    staffList: StaffDto[] = []; //list of all active staff
    staffIds: AppointmentPhaseDto[] = [];
    appointmentId: number = 0;
    operationRequestId: number = 0;
    operationRequestDeadline: string = '';
    operationRequestPriority: string = '';
    patientId: string = '';
    patientName: string = '';
    appointmentStatus: string = '';

    constructor(private fb: FormBuilder, private appointmentService: AppointmentService, private patientService: PatientService,
        private staffService: StaffService, private operationRequestService: OperationRequestService,
        private operationTypeService: OperationTypeService, private toastr: ToastrService,
        private roomService: SurgeryRoomService, private route: ActivatedRoute, private router: Router) {
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
            this.appointmentId = params['id'];
            this.getAppointment();
        });
    }

    get phases() {
        return this.appointmentForm.get('phases') as FormArray;
    }

    changeStaff(i: number, j: number, e: any) {
        this.staffIds[i].staff[j] = e.target.value;
    }

    async getAppointment() {
        this.appointmentService.getAppointmentById(this.appointmentId).subscribe({
            next: (resultAppointment: AppointmentDto | null) => {
                if (resultAppointment != null) {
                    this.appointmentStatus = resultAppointment.status;
                    for (let i = 0; i < resultAppointment.phases.length; i++) {
                        let phaseStaffIds: string[] = [];
                        this.staffIds.push({ staff: phaseStaffIds });
                        for (let j = 0; j < resultAppointment.phases[i].staff.length; j++) {
                            phaseStaffIds.push(resultAppointment.phases[i].staff[j]);
                        }
                    }
                    this.appointmentForm.controls['dateTime'].setValue(resultAppointment.dateTime);
                    this.appointmentForm.controls['room'].setValue(resultAppointment.room);
                    this.operationRequestId = resultAppointment.originatingOperationRequest;
                    this.getOperationRequest();
                } else {
                    this.toastr.error('Appointment not found', 'Error');
                    this.sendToSearch();
                }
            },
            error: (err: HttpErrorResponse) => {
                this.toastr.error('Appointment not found', 'Error');
                this.sendToSearch();
            }
        });
    }

    async getOperationRequest() {
        this.operationRequestService.getOperationRequestById(this.operationRequestId).subscribe({
            next: (resultOperationRequest: OperationRequestDto | null) => {
                if (resultOperationRequest != null) {
                    this.operationRequestDeadline = resultOperationRequest.deadlineDate.toString().substring(0, 10);
                    this.operationRequestPriority = resultOperationRequest.priority;
                    this.getOperationType(resultOperationRequest.operationType);
                    this.getPatient(resultOperationRequest.patientMedicalRecordNumber);
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
                        let staffs = phases.at(i).get('staffs') as FormArray;
                        let specializationsMap: { [key: number]: number } = resultOperationType.phases[i].specializations;
                        for (let j = 0; j < Object.keys(specializationsMap).length; j++) {
                            let [key, value] = Object.entries(specializationsMap)[j];
                            for (let v = 0; v < value; v++) {
                                staffs.push(new FormGroup({
                                    'specialization': new FormControl(key)
                                }));
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
        const UpdatingAppointmentDto = {
            id: this.appointmentId,
            dateTime: this.appointmentForm.value.dateTime,
            originatingOperationRequest: this.operationRequestId,
            room: this.appointmentForm.value.room,
            phases: this.staffIds,
        }
        return UpdatingAppointmentDto;
    }

    updateAppointment() {
        this.appointment = this.createDTO();

        if (this.appointment == null)
            return alert("Appointment invalid, unexpected error!");

        if (this.appointmentStatus.toLowerCase() !== 'scheduled')
            return alert("Appointment not scheduled, cannot be updated");

        this.appointmentService.updateAppointment(this.appointment).subscribe({
            next: () => {
                this.toastr.success('Appointment updated successfully', 'Success');
                this.sendToSearch();
            },
            error: (err: HttpErrorResponse) => {
                this.toastr.error('Failed to update appointment\n' + err.error.message, 'Error');
            }
        })
    }

    sendToSearch() {
        this.router.navigate(['/doctor/appointment/search']);
    }
}