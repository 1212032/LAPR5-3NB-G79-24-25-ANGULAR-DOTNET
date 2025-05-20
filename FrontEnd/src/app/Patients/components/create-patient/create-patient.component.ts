import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { PatientModel } from '../../model/patientModel';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MedicalRecordService } from '../../../MedicalRecord/services/medical-record.service';
import MedicalRecordDTO from '../../../MedicalRecord/dto/MedicalRecordDTO';

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class CreatePatientComponent {
  patientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router, private toastr: ToastrService,
  ) {
    this.patientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      address: [''],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      emergencyContact: [''],
    });
  }

  onSubmit() {
    if (this.patientForm.valid) {
      const newPatient: PatientModel = this.patientForm.value;
      this.patientService.createPatient(newPatient).subscribe({
        next: (patient) => {
          this.toastr.success('Patient created successfully', 'Success');
          this.router.navigate(['/admin/patient/search']);
        },
        error: (error: HttpErrorResponse) => {
          this.toastr.error('Error creating patient:\n' + error.error.message, 'Error');
        },
      });
    } else {
      this.patientForm.markAllAsTouched();
    }
  }
}
