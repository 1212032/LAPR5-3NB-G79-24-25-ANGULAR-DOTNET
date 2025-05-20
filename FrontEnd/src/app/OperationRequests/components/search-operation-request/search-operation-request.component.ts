import { Component, inject, Input, input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OperationTypeDto } from '../../../OperationTypes/dto/operationTypeDto';
import { PatientDto } from '../../../Patients/dto/patientDto';
import { OperationRequestService } from '../../services/operationRequest.service';
import { CommonModule, DatePipe } from '@angular/common';
import { OperationRequestDto } from '../../dto/operationRequestDto';
import { OperationRequestModel } from '../../model/operation-request.model';
import { ToastrService } from 'ngx-toastr';
import { Sort, MatSortModule } from '@angular/material/sort';
import { Router, RouterOutlet } from '@angular/router';


@Component({
    selector: 'app-search-operation-request',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, MatSortModule, RouterOutlet],
    templateUrl: './search-operation-request.component.html',
    styleUrl: './search-operation-request.component.css'
})
export class SearchOperationRequestComponent {
    operationRequestForm: FormGroup;
    operationRequestModelList?: OperationRequestModel[] = [];
    operationTypes?: OperationTypeDto[];
    patients?: PatientDto[];
    filtersForm: FormGroup;
    wantToRemove: boolean = false;
    minDate: any;
    dateSent: any;
    minValue: any;
    datePipe: DatePipe = new DatePipe('en-US');

    selectedOperationRequest: OperationRequestModel = {
        id: 0,
        deadLineDate: new Date(),
        priority: '',
        operationType: {
            id: 0,
            active: false,
            name: '',
            phases: []
        },
        patient: {
            id: '',
            firstName: '',
            lastName: '',
            fullName: '',
            medicalRecord: '',
            emergencyContact: '',
            gender: '',
            dateOfBirth: '',
            email: '',
            phone: '',
            address: ''
        },
        status: ''
    };
    selectedIndex: number = -1;
    opIsSelected: boolean = false;
    constructor(
        private fb: FormBuilder,
        private service: OperationRequestService,
        private toastr: ToastrService,
        private router: Router,
    ) {
        this.minDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        this.operationRequestForm = this.fb.group({
            deadlineDate: ['', Validators.required],
            priority: ['', Validators.required],
            operationType: ['', Validators.required],
            patientMedicalRecordNumber: ['', Validators.required]
        })
        this.filtersForm = this.fb.group({
            patientNameFilter: '',
            patientMedicalRecordNumberFilter: '',
            operationTypeFilter: '',
            priorityFilter: '',
            startDateFilter: '',
            endDateFilter: ''
        })
    }
    async ngOnInit(): Promise<void> {
        this.operationRequestModelList = [];
        await this.getAllPatients();
        await this.getAllOperationTypes();
        this.searchWithFilters();
    }
    openDialog(): void {

    }
    changeDate() {
        if (this.minDate <= this.dateSent) {
            this.minValue = this.dateSent;
        }
        this.minDate = this.dateSent;
    }
    sortData(sort: Sort) {
        const data = this.operationRequestModelList?.slice();
        if (!sort.active || sort.direction == '') {
            this.operationRequestModelList = data;
            return;
        }
        if (data == null) {
            return;
        }
        this.operationRequestModelList = data.sort((op1, op2) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'patient':
                    return this.compare(op1.patient.fullName, op2.patient.fullName, isAsc);
                case 'operationType':
                    return this.compare(op1.operationType.name, op2.operationType.name, isAsc);
                case 'priority':
                    return this.compare(op1.priority, op2.priority, isAsc);
                case 'deadlineDate':
                    return this.compare(op1.deadLineDate, op2.deadLineDate, isAsc);
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

    async getAllOperationTypes() {
        this.service.getAllOperationTypes().subscribe({
            next: (resultOperationTypes) => {
                if (resultOperationTypes != null) {
                    this.operationTypes = resultOperationTypes;

                    this.searchWithFilters();
                } else {

                    this.toastr.error("Operation request invalid, unexpected error!", 'Error');
                }
            },
            error: (err) => {
                this.toastr.error("Operation request invalid, unexpected error!\n" + err.error.message, 'Error');

            }
        });
    }
    async getAllPatients() {
        this.service.getAllPatients().subscribe({
            next: (resultPatients) => {
                if (resultPatients != null) {
                    this.patients = resultPatients;
                }
            },
            error: (err) => {
                this.toastr.error(err.error.message, 'Error');
            }
        });
    }
    searchWithFilters() {
        let patientName = this.filtersForm.value.patientNameFilter;
        let patientMedicalRecordNumber = this.filtersForm.value.patientMedicalRecordNumberFilter;
        let operationType = this.filtersForm.value.operationTypeFilter;
        let priority = this.filtersForm.value.priorityFilter;
        let startDate = new Date(this.filtersForm.value.startDateFilter);
        let endDate = new Date(this.filtersForm.value.endDateFilter);

        this.service.searchOperationRequestWithFilters(priority, operationType, patientName, patientMedicalRecordNumber, startDate, endDate)
            .subscribe({
                next: (resultOpRequest) => {
                    if (resultOpRequest != null) {
                        this.operationRequestModelList = [];
                        resultOpRequest?.forEach((operationRequest) => {
                            if (operationRequest != null) {
                                let opType: OperationTypeDto = this.operationTypes?.find(opType => opType.id === operationRequest.operationType) ?? { id: 0, active: false, name: '', phases: [] };
                                let patient: PatientDto = this.patients?.find(pat => pat.id === operationRequest.patientMedicalRecordNumber) ?? { id: '', firstName: '', lastName: '', fullName: '', medicalRecord: '', emergencyContact: '', gender: '', dateOfBirth: new Date().toISOString(), email: '', phone: '', address: '' };

                                const dateParts = operationRequest.deadlineDate.split(/[\s/:]/);
                                const date = new Date(
                                    +dateParts[2], // year
                                    +dateParts[1] - 1, // month (0-based index)
                                    +dateParts[0], // day
                                );
                                let opModel: OperationRequestModel = {
                                    id: operationRequest.id,
                                    deadLineDate: date,
                                    priority: operationRequest.priority,
                                    operationType: opType,
                                    patient: patient,
                                    status: operationRequest.status
                                }
                                this.operationRequestModelList?.push(opModel);
                            }

                        });
                    }
                }
            });
    }
    createForm(operationRequest: OperationRequestModel) {
        const dateParts = operationRequest.deadLineDate.toLocaleString().split(/[\s/:]/);
        let date = dateParts[2].replaceAll(',', '') + '-' + dateParts[1] + '-' + dateParts[0];
        this.operationRequestForm = new FormGroup({
            deadlineDate: new FormControl(date),
            priority: new FormControl(operationRequest.priority),
            operationType: new FormControl(operationRequest.operationType.id),
            patientMedicalRecordNumber: new FormControl(operationRequest.patient.id),
        })
    }

    editOperationRequest(operationRequest: OperationRequestModel) {
        this.router.navigate(['/doctor/operationrequest/update', operationRequest.id]);
    }
    removeOperationRequest() {
        this.service.removeOperationRequest(this.selectedOperationRequest.id).subscribe({
            next: (response) => {
                if (this.operationRequestModelList) {
                    this.operationRequestModelList.splice(this.selectedIndex, 1);
                }
                this.toastr.success('Operation request removed successfully', 'Success');
            },
            error: (err) => {
                this.toastr.error(err.error.message, 'Error');
            }
        });
    }
    selectOperationRequestToRemove(operationRequest: OperationRequestModel, index: number) {
        this.selectedOperationRequest = operationRequest;
        this.selectedIndex = index;
    }

    createAppointment(operationRequest: OperationRequestModel) {
        this.router.navigate(['/doctor/appointment/create', operationRequest.id]);
    }
}