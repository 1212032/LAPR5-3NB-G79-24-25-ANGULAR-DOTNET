import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientUserService } from '../../services/patientUser.service';
import { CommonModule } from '@angular/common';
import { PatientDto } from '../../dto/patientDto';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { CreatePatientRequestDto } from '../../dto/createPatientRequestDto';

@Component({
    selector: 'app-update-patient-user',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './update-patient-user.component.html',
    styleUrl: './update-patient-user.component.css'
})
export class UpdatePatientUserComponent implements OnInit {
    patientForm!: FormGroup;
    patient!: CreatePatientRequestDto;
    currentPatientId: string;
    buttonDisabled: boolean = false;

    constructor(private fb: FormBuilder, private service: PatientUserService, private toastr: ToastrService) {
        this.currentPatientId = "";
    }

    async ngOnInit(): Promise<void> {
        this.patientForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            emergencyContact: ['', Validators.required],
            address: ['', Validators.required],
            dateOfBirth: [{ value: '', disabled: true }, Validators.required],
            gender: [{ value: '', disabled: true }, Validators.required]
        })
        this.getPatient();
    }

    private getPatient() {
        this.service.getPatient().subscribe({
            next: (resultPatient: PatientDto | null) => {
                if (resultPatient != null) {
                    this.currentPatientId = resultPatient.id;
                    this.patientForm.controls['firstName'].setValue(resultPatient.firstName);
                    this.patientForm.controls['lastName'].setValue(resultPatient.lastName);
                    this.patientForm.controls['email'].setValue(resultPatient.email);
                    this.patientForm.controls['phone'].setValue(resultPatient.phone);
                    this.patientForm.controls['emergencyContact'].setValue(resultPatient.emergencyContact);
                    this.patientForm.controls['address'].setValue(resultPatient.address);
                    this.patientForm.controls['dateOfBirth'].setValue(resultPatient.dateOfBirth.toString().substring(0, 10));
                    this.patientForm.controls['gender'].setValue(resultPatient.gender);
                } else {
                    this.toastr.error('Profile not found', 'Error');
                }
            },
            error: (err: HttpErrorResponse) => {
                this.toastr.error('Profile not found\n' + err.error.message, 'Error');
            }
        });
    }

    createDto() {
        const patientRequestDto = {
            requestType: "Update",
            firstName: this.patientForm.value.firstName,
            lastName: this.patientForm.value.lastName,
            emergencyContact: this.patientForm.value.emergencyContact,
            phone: this.patientForm.value.phone,
            address: this.patientForm.value.address,
            email: this.patientForm.value.email
        }
        return patientRequestDto;
    }

    requestPatientUpdate() {
        if (this.currentPatientId == null || this.currentPatientId == "") return;

        this.patient = this.createDto();

        if (this.patient == null)
            return alert("Patient invalid, unexpected error!");

        this.service.sendPatientRequest(this.patient).subscribe({
            next: () => {
                this.toastr.success('Profile update successfully requested', 'Success');
                this.buttonDisabled = true;
            },
            error: (err: HttpErrorResponse) => {
                this.toastr.error('Failed to request profile update\n' + err.error.message, 'Error');
            }
        })
    }
}
