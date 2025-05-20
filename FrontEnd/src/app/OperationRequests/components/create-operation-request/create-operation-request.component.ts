import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { OperationRequestService } from '../../services/operationRequest.service';
import { StaffDto } from '../../../Staff/dto/staffDto';
import { CommonModule, DatePipe } from '@angular/common';
import { OperationTypeDto } from '../../../OperationTypes/dto/operationTypeDto';
import { PatientDto } from '../../../Patients/dto/patientDto';
import { CreatingOperationRequestDto } from '../../dto/creatingOperationRequestDto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-operation-request',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-operation-request.component.html',
  styleUrl: './create-operation-request.component.css'
})
export class CreateOperationRequestComponent implements OnInit {
  operationRequestForm: FormGroup;
  operationRequest?: CreatingOperationRequestDto;
  doctors?: StaffDto[];
  operationTypes?: OperationTypeDto[];
  patients?: PatientDto[];

  minDate: any;
  selectedDate!: Date;
  

  datePipe: DatePipe = new DatePipe('en-US');

  
  constructor(private fb: FormBuilder,
    private service: OperationRequestService,
    private toastr: ToastrService
  ) {    
    this.minDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.operationRequestForm = this.fb.group({
      deadlineDate: ['', Validators.required, ],
      priority: ['', Validators.required],
      operationType: ['', Validators.required],
      patientMedicalRecordNumber: ['', Validators.required]
    });
    //this.operationRequestForm.controls['deadlineDate'].setValue(this.minDate);
  }
  async ngOnInit(): Promise<void> {
  
    await this.getAllPatients();
    await this.getAllOperationTypes();
  }

  async getAllOperationTypes() {
    this.service.getAllOperationTypes().subscribe({
      next: (resultOperationTypes) => {
        if (resultOperationTypes != null) {
          this.operationTypes = resultOperationTypes;
        }
      },
      error: (err) => {
        this.toastr.error('Failed to fetch operation types\n'+ err.error.messages, 'Error');
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
        this.toastr.error('Failed to fetch patients\n'+ err.error.messages, 'Error');

      }
    });
  }

  createDto() {
    const creatingOperationRequestDto = {
      deadlineDate: this.operationRequestForm.value.deadlineDate,
      priority: this.operationRequestForm.value.priority,
      operationType: this.operationRequestForm.value.operationType,
      patientMedicalRecordNumber: this.operationRequestForm.value.patientMedicalRecordNumber,
    }

    return creatingOperationRequestDto;
  }
  createOperationRequest() {
    const selectedDate = new Date(this.operationRequestForm.value.deadlineDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      return this.toastr.error('Deadline date must be in the future!', 'Error');
    }
    if (this.operationRequestForm.invalid) {
      return this.toastr.error('Please fill in all required fields!', 'Error');
    }

    this.operationRequest = this.createDto();

    if (this.operationRequest == null)
      return alert("Operation request invalid, unexpected error!");

    this.service.createOperationRequest(this.operationRequest).subscribe({
      next: (response) => {
        this.toastr.success('Operation request created successfully', 'Success');
        this.operationRequestForm.reset();
      },
      error: (err) => {
        this.toastr.error('Failed to create operation request\n'+ err.error.messages, 'Error');
      }
    })
  }
}
