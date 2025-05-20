import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../services/patient.service';
import { PatientModel } from '../../model/patientModel';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { TokenDecodeService } from '../../../Shared/services/token-decode.service';
import { UpdateMedicalRecordComponent } from '../../../MedicalRecord/components/update-medical-record/update-medical-record.component';

@Component({
    selector: 'app-update-patient',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, UpdateMedicalRecordComponent],
    templateUrl: './update-patient.component.html',
    styleUrls: ['./update-patient.component.css']
})
export class UpdatePatientComponent implements OnInit {
    tokenService = inject(TokenDecodeService);
    patientForm: FormGroup;
    patientId: string = '';
    title: string = 'Update Patient';

    constructor(private fb: FormBuilder, private patientService: PatientService, private route: ActivatedRoute,
        private router: Router, private toastr: ToastrService) {

        this.patientForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            emergencyContact: [''],
            gender: ['', Validators.required],
            dateOfBirth: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: [''],
            address: ['']
        });
    }

    ngOnInit(): void {
        this.patientId = this.route.snapshot.paramMap.get('id') || '';
        if (this.patientId) {
            this.loadPatientData();
        }
        if (!this.canUpdate()) {
            this.title = 'Patient';
        }
    }

    loadPatientData(): void {
        this.patientService.getPatientById(this.patientId).subscribe({
            next: (patient) => {
                const formattedPatient = {
                    ...patient,
                    dateOfBirth: new Date(patient.dateOfBirth).toISOString().split('T')[0],
                };

                this.patientForm.patchValue(formattedPatient);
            },
            error: (err) => {
                this.toastr.error('Failed to fetch patient data.\n' + err, 'Error');
            }
        });
    }

    updatePatient(): void {
        if (this.patientForm.valid) {
            const updatedPatient: PatientModel = { ...this.patientForm.value, id: this.patientId };

            this.patientService.updatePatient(this.patientId, updatedPatient).subscribe({
                next: () => {
                    this.toastr.success('Patient updated successfully!', 'Success');
                    this.router.navigate(['/admin/patient/search']);
                },
                error: (err: HttpErrorResponse) => {
                    this.toastr.error('Error updating patient:\n' + err.error.message, 'Error');
                }
            });
        } else {
            this.patientForm.markAllAsTouched();
            this.toastr.error('Please fill out all required fields.', 'Error');
        }
    }

    canUpdate() {
        return !(this.tokenService.getUserRole().toLowerCase() === 'doctor');
    }
}
