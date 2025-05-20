import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { OperationRequestService } from '../../services/operationRequest.service';
import { ToastrService } from 'ngx-toastr';
import { OperationTypeDto } from '../../../OperationTypes/dto/operationTypeDto';
import { PatientDto } from '../../../Patients/dto/patientDto';
import { OperationRequestModel } from '../../model/operation-request.model';
import { OperationRequestDto } from '../../dto/operationRequestDto';
import { CommonModule, DatePipe } from '@angular/common';
import { UpdatingOperationRequestDto } from '../../dto/updatingOperationRequestDto';

@Component({
    selector: 'app-update-operation-request',
    standalone: true,
    imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
    templateUrl: './update-operation-request.component.html',
    styleUrl: './update-operation-request.component.css'
})
export class UpdateOperationRequestComponent {
    operationRequestForm!: FormGroup;
    operationRequestId: number = 0;
    //changed: boolean = false;
    operationTypes?: OperationTypeDto[];
    patients?: PatientDto[];
    minDate: any;
    datePipe: DatePipe = new DatePipe('en-US');


    operationRequest: OperationRequestModel = {
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

    constructor(private fb: FormBuilder, private service: OperationRequestService,
        private toastr: ToastrService, private route: ActivatedRoute, private router: Router) {
        this.minDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

        this.operationRequestForm = this.fb.group({
            deadlineDate: ['', Validators.required],
            priority: ['', Validators.required],
            operationType: ['', Validators.required],
            patientMedicalRecordNumber: ['', Validators.required]
        })
    }

    async ngOnInit(): Promise<void> {
        this.route.params.subscribe(params => { this.operationRequestId = params['id']; });

        await this.getAllPatients();
        await this.getAllOperationTypes();
        await this.getOperationRequestById();

        //this.operationRequestForm.valueChanges.subscribe(() => {this.changed = true;});
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
    async getAllOperationTypes() {
        this.service.getAllOperationTypes().subscribe({
            next: (resultOperationTypes) => {
                if (resultOperationTypes != null) {
                    this.operationTypes = resultOperationTypes;

                } else {

                    this.toastr.error("Operation request invalid, unexpected error!", 'Error');
                }
            },
            error: (err) => {
                this.toastr.error("Operation request invalid, unexpected error! " + err.error.message, 'Error');

            }
        });
    }
    async getOperationRequestById() {
        this.service.getOperationRequestById(this.operationRequestId).subscribe({
            next: (operationRequest: OperationRequestDto) => {
                if (operationRequest == null) {
                    this.toastr.error('Operation type not found', 'Error');
                    this.sendToSearch();
                } else {
                    let opType: OperationTypeDto = this.operationTypes?.find(opType => opType.id === operationRequest.operationType) ?? { id: 0, active: false, name: '', phases: [] };
                    let patient: PatientDto = this.patients?.find(pat => pat.id === operationRequest.patientMedicalRecordNumber) ?? { id: '', firstName: '', lastName: '', fullName: '', medicalRecord: '', emergencyContact: '', gender: '', dateOfBirth: new Date().toISOString(), email: '', phone: '', address: '' };

                    if (operationRequest != undefined && operationRequest.deadlineDate) {
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

                        this.operationRequest = opModel;

                        this.updateOperationRequestForm();
                    }
                }

            }
        });
    }
    updateOperationRequestForm() {
        const dateParts = this.operationRequest.deadLineDate.toLocaleString().split(/[\s/:]/);
        let date = dateParts[2].replaceAll(',', '') + '-' + dateParts[1] + '-' + dateParts[0];
        this.operationRequestForm = new FormGroup({
            deadlineDate: new FormControl(date),
            priority: new FormControl(this.operationRequest.priority),
            operationType: new FormControl(this.operationRequest.operationType.id),
            patientMedicalRecordNumber: new FormControl(this.operationRequest.patient.id),
        })
    }
    createOperationRequestDto() {
        const operationRequestDto: UpdatingOperationRequestDto = {
            id: this.operationRequestId,
            deadlineDate: this.operationRequestForm.value.deadlineDate,
            priority: this.operationRequestForm.value.priority,
            operationType: this.operationRequestForm.value.operationType,
            patientMedicalRecordNumber: this.operationRequestForm.value.patientMedicalRecordNumber
        }

        return operationRequestDto;
    }
    updateOnSubmit() {
        let creatingOP = this.createOperationRequestDto();

        if (creatingOP == null) {
            this.toastr.error("Operation request invalid, unexpected error!", 'Error');
            return;
        }
        // if(!this.changed){
        //   this.toastr.error("No changes detected!", 'Error');
        //   return;
        // }
        this.service.updateOperationRequest(creatingOP).subscribe({
            next: (response) => {
                this.toastr.success('Operation request updated successfully', 'Success');
                this.sendToSearch();
                //this.changed = false;
            },
            error: (err) => {
                this.toastr.error(err.error.message, 'Error');

            }
        })
    }

    sendToSearch() {
        this.router.navigate(['/doctor/operationrequest/search']);
    }
}
