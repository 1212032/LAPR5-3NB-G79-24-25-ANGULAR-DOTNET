import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OperationTypeDto } from '../../../OperationTypes/dto/operationTypeDto';
import { PatientDto } from '../../../Patients/dto/patientDto';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Sort, MatSortModule } from '@angular/material/sort';
import { Router, RouterOutlet } from '@angular/router';
import { SurgeryRoomService } from '../../../SurgeryRooms/services/surgeryRoom.service';
import { PatientService } from '../../../Patients/services/patient.service';
import { AppointmentService } from '../../services/appointment.service';
import { SurgeryRoomDto } from '../../../SurgeryRooms/dto/surgeryRoomDto';
import { PatientModel } from '../../../Patients/model/patientModel';
import { StaffDto } from '../../../Staff/dto/staffDto';
import { StaffService } from '../../../Staff/services/staff.service';
import { AppointmentDto } from '../../dto/appointmentDto';

@Component({
    selector: 'app-search-appointment',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, MatSortModule, RouterOutlet],
    templateUrl: './search-appointment.component.html',
    styleUrl: './search-appointment.component.css'
})
export class SearchAppointmentComponent {
    appointmentList?: AppointmentTableDto[] = undefined;
    patients: PatientModel[] = [];
    staffs: StaffDto[] = [];
    filtersForm: FormGroup;
    rooms: SurgeryRoomDto[] = [];

    constructor(private fb: FormBuilder, private roomService: SurgeryRoomService,
        private staffService: StaffService, private appointmentService: AppointmentService, private router: Router) {
        this.filtersForm = this.fb.group({
            patientNameFilter: '',
            patientMedicalRecordNumberFilter: '',
            roomFilter: '',
            priorityFilter: '',
            startDateFilter: '',
            endDateFilter: '',
            staffFilter: '',
        })
    }

    async ngOnInit(): Promise<void> {
        await this.getAllStaff();
        await this.getAllRooms();
        this.searchWithFilters();
    }

    sortData(sort: Sort) {
        if (this.appointmentList == null || this.appointmentList == undefined) {
            return;
        }
        const data = this.appointmentList.slice();
        if (!sort.active || sort.direction == '') {
            this.appointmentList = data;
            return;
        }
        if (data == null) {
            return;
        }
        this.appointmentList = data.sort((op1, op2) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'patient':
                    return this.compare(op1.patientId + ' - ' + op1.patientFullName, op2.patientId + ' - ' + op2.patientFullName, isAsc);
                case 'dateTime':
                    return this.compare(op1.dateTime, op2.dateTime, isAsc);
                case 'room':
                    return this.compare(op1.room, op2.room, isAsc);
                default:
                    return 0;
            }
        });
    }

    compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
        if (a instanceof Date && b instanceof Date) {
            return (a.getTime() - b.getTime()) * (isAsc ? 1 : -1);
        } else if (typeof a === 'string' && typeof b === 'string') {
            return a.localeCompare(b) * (isAsc ? 1 : -1);
        } else if (typeof a === 'number' && typeof b === 'number') {
            return (a - b) * (isAsc ? 1 : -1);
        } else {
            return 0;
        }
    }

    async getAllStaff() {
        if (this.staffs == null || this.staffs.length === 0) {
            this.staffService.getAllStaff().subscribe({
                next: (resultStaffs: StaffDto[] | null) => {
                    if (resultStaffs != null) {
                        this.staffs = resultStaffs;
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

    searchWithFilters() {
        let patientName = this.filtersForm.value.patientNameFilter;
        let patientMedicalRecordNumber = this.filtersForm.value.patientMedicalRecordNumberFilter;
        let room = this.filtersForm.value.roomFilter;
        let priority = this.filtersForm.value.priorityFilter;
        let startDate: Date = this.filtersForm.value.startDateFilter;
        let endDate: Date = this.filtersForm.value.endDateFilter;
        let staff = this.filtersForm.value.staffFilter;
        this.appointmentList = [];

        this.appointmentService.getAppointments(patientName, patientMedicalRecordNumber, room, priority, startDate, endDate, staff)
            .subscribe({
                next: (resultAppointments: AppointmentDto[] | null) => {
                    if (resultAppointments != null) {
                        this.appointmentList = [];
                        resultAppointments?.forEach((appointment) => {
                            if (appointment != null) {
                                let dateTime: string = appointment.dateTime.toString();
                                dateTime = dateTime.substring(8, 10) + "/" + dateTime.substring(5, 7) + "/" + dateTime.substring(0, 4) + " " + dateTime.substring(11, 13) + ":" + dateTime.substring(14, 16);

                                let opModel: AppointmentTableDto = {
                                    id: appointment.id,
                                    patientId: appointment.patientId,
                                    patientFullName: appointment.patientFullName,
                                    dateTime: dateTime,
                                    room: appointment.surgeryRoomName
                                }
                                this.appointmentList?.push(opModel);
                            }
                        });
                    }
                }
            });
    }

    updateAppointment(appointment: AppointmentTableDto) {
        this.router.navigate(['/doctor/appointment/update', appointment.id]);
    }
}

export interface AppointmentTableDto {
    id: number,
    patientId: string
    patientFullName: string,
    dateTime: string,
    room: string
}