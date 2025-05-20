import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { PatientModel } from '../../model/patientModel';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { TokenDecodeService } from '../../../Shared/services/token-decode.service';
import { MessageDto } from '../../../PatientUser/dto/messageDto';

@Component({
    selector: 'app-search-patient',
    standalone: true,
    templateUrl: './search-patient.component.html',
    styleUrls: ['./search-patient.component.css'],
    imports: [ReactiveFormsModule, CommonModule, MatSortModule],
})
export class SearchPatientComponent {
    tokenService = inject(TokenDecodeService);
    searchForm: FormGroup;
    patients: PatientModel[] = [];
    sortedPatients: PatientModel[] = [];

    constructor(private fb: FormBuilder, private patientService: PatientService, private router: Router, private toastr: ToastrService) {
        this.searchForm = this.fb.group({
            name: [''],
            email: [''],
            dateOfBirth: [''],
            medicalRecordNumber: [''],
        });
    }

    searchPatients() {
        const formValues = this.searchForm.value;

        const queryParams = {
            name: formValues.name,
            email: formValues.email,
            dateOfBirth: formValues.dateOfBirth,
            medicalRecordNumber: formValues.medicalRecordNumber,
            pageNumber: 1,
            pageSize: 10,
        };

        this.patientService.searchPatients(queryParams).subscribe({
            next: (data) => {
                this.patients = data;
                this.sortedPatients = [...this.patients];
            },
            error: (err) => {
                this.toastr.error('Error fetching search results:\n' + err, 'Error');
            },
        });
    }

    sortData(sort: Sort) {
        const data = this.patients.slice();
        if (!sort.active || sort.direction === '') {
            this.sortedPatients = data;
            return;
        }

        this.sortedPatients = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'name':
                    return this.compare(a.firstName, b.firstName, isAsc);
                case 'email':
                    return this.compare(a.email, b.email, isAsc);
                case 'dateOfBirth':
                    return this.compare(a.dateOfBirth, b.dateOfBirth, isAsc);
                default:
                    return 0;
            }
        });
    }

    private compare(a: string | number | Date, b: string | number | Date, isAsc: boolean): number {
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

    editPatient(patient: PatientModel) {
        if (this.tokenService.getUserRole().toLowerCase() === 'doctor') {
            this.router.navigate(['/doctor/patient/update', patient.id]);
        } else {
            this.router.navigate(['/admin/patient/update', patient.id]);
        }
    }

    deletePatient(patient: PatientModel) {
        if (confirm(`Are you sure you want to delete ${patient.firstName} ${patient.lastName}?`)) {
            this.patientService.deletePatient(patient.id).subscribe({
                next: (messageDto: MessageDto) => {
                    this.toastr.success(messageDto.message, 'Success');
                    this.searchPatients();
                },
                error: (err: HttpErrorResponse) => {
                    this.toastr.error('Failed to delete profile\n' + err.error.message, 'Error');
                }
            });
        }
    }

    canUpdateDelete() {
        return this.tokenService.getUserRole().toLowerCase() === 'admin';
    }
}
