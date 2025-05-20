import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientUserService } from '../../services/patientUser.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { PatientRequestDto } from '../../dto/patientRequestDto';
import { PatientDto } from '../../dto/patientDto';
import { CreatePatientRequestDto } from '../../dto/createPatientRequestDto';

@Component({
    selector: 'app-delete-patient-user',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './delete-patient-user.component.html',
    styleUrl: './delete-patient-user.component.css'
})
export class DeletePatientUserComponent implements OnInit {
    patientFound: boolean = false;
    constructor(private fb: FormBuilder, private service: PatientUserService, private toastr: ToastrService) { }

    async ngOnInit(): Promise<void> {
        await this.getPatient();
    }

    private async getPatient() {
        this.patientFound = false;
        this.service.getPatient().subscribe({
            next: (resultPatient: PatientDto | null) => {
                if (resultPatient != null) {
                    this.patientFound = true;
                } else {
                    this.toastr.error('Profile not found', 'Error');
                }
            },
            error: (err: HttpErrorResponse) => {
                this.toastr.error('Profile not found\n' + err.error.message, 'Error');
            }
        });
    }

    requestPatientDeletion() {
        let patientRequest: CreatePatientRequestDto = {
            requestType: 'Delete', firstName: '', lastName: '',
            emergencyContact: '', phone: '', address: '', email: ''
        }

        this.service.sendPatientRequest(patientRequest).subscribe({
            next: (patientRequestDto: PatientRequestDto) => {
                this.toastr.success('Profile deletion successfully requested', 'Success');
                this.patientFound = false;
            },
            error: (err: HttpErrorResponse) => {
                this.toastr.error('Failed to request profile deletion\n' + err.error.message, 'Error');
            }
        })
    }
}
