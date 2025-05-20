import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { OperationTypeService } from '../../services/operationType.service';
import { CommonModule } from '@angular/common';
import { SpecializationDto } from '../../../Staff/dto/specializationDto';
import { UpdatingOperationTypeDto } from '../../dto/updatingOperationTypeDto';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationTypeDto } from '../../dto/operationTypeDto';

@Component({
    selector: 'app-update-operation-type',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './update-operation-type.component.html',
    styleUrl: './update-operation-type.component.css'
})
export class UpdateOperationTypeComponent implements OnInit {
    operationTypeForm!: FormGroup;
    operationType?: UpdatingOperationTypeDto;
    specializations?: SpecializationDto[];
    operationTypeId: number;

    constructor(private fb: FormBuilder, private service: OperationTypeService,
        private toastr: ToastrService, private route: ActivatedRoute, private router: Router) {
        this.operationTypeId = 0;
    }

    async ngOnInit(): Promise<void> {
        this.route.params.subscribe(params => { this.operationTypeId = params['id']; });
        this.operationTypeForm = this.fb.group({
            name: ['', Validators.required],
            preparationPhaseDuration: ['', Validators.required],
            preparationPhaseSpecializations: this.fb.array([]),
            surgeryPhaseDuration: ['', Validators.required],
            surgeryPhaseSpecializations: this.fb.array([]),
            cleaningPhaseDuration: ['', Validators.required],
            cleaningPhaseSpecializations: this.fb.array([]),
        })
        await this.getAllSpecializations();
        this.getOperationType();
    }

    get preparationPhaseSpecializations() {
        return this.operationTypeForm.get('preparationPhaseSpecializations') as FormArray;
    }
    get surgeryPhaseSpecializations() {
        return this.operationTypeForm.get('surgeryPhaseSpecializations') as FormArray;
    }
    get cleaningPhaseSpecializations() {
        return this.operationTypeForm.get('cleaningPhaseSpecializations') as FormArray;
    }

    addSpecialization(specializationsPhase: string) {
        const specializations = this.operationTypeForm.get(specializationsPhase) as FormArray;
        specializations.push(this.createSpecializationFormGroup());
    }

    removeSpecialization(specializationsPhase: string, i: number) {
        const specializations = this.operationTypeForm.get(specializationsPhase) as FormArray;
        specializations.removeAt(i);
    }

    private createSpecializationFormGroup(): FormGroup {
        return new FormGroup({
            'specialization': new FormControl('', Validators.required),
            'count': new FormControl('', Validators.required)
        })
    }

    createSpecializationFormGroupWithValues(specialization: number, count: number): FormGroup {
        return new FormGroup({
            'specialization': new FormControl(specialization, Validators.required),
            'count': new FormControl(count, Validators.required)
        })
    }

    async getAllSpecializations() {
        if (this.specializations == null || this.specializations.length) {
            this.service.getAllSpecializations().subscribe({
                next: (resultSpecializations: SpecializationDto[] | null) => {
                    if (resultSpecializations != null) {
                        this.specializations = resultSpecializations;
                    }
                }
            });
        }
    }

    private getOperationType() {
        this.service.getOperationTypeById(this.operationTypeId).subscribe({
            next: (resultOperationType: OperationTypeDto | null) => {
                if (resultOperationType != null) {
                    this.operationTypeForm.controls['name'].setValue(resultOperationType.name);
                    for (let i = 0; i < resultOperationType.phases.length; i++) {
                        let formArray: FormArray;
                        switch (i) {
                            case 0:
                                this.operationTypeForm.controls['preparationPhaseDuration'].setValue(resultOperationType.phases[i].duration);
                                formArray = this.operationTypeForm.get('preparationPhaseSpecializations') as FormArray;
                                break;
                            case 1:
                                this.operationTypeForm.controls['surgeryPhaseDuration'].setValue(resultOperationType.phases[i].duration);
                                formArray = this.operationTypeForm.get('surgeryPhaseSpecializations') as FormArray;
                                break;
                            case 2:
                                this.operationTypeForm.controls['cleaningPhaseDuration'].setValue(resultOperationType.phases[i].duration);
                                formArray = this.operationTypeForm.get('cleaningPhaseSpecializations') as FormArray;
                                break;
                            default:
                                continue;
                        }
                        let specializationsMap: { [key: number]: number } = resultOperationType.phases[i].specializations;
                        for (let j = 0; j < Object.keys(specializationsMap).length; j++) {
                            let [key, value] = Object.entries(specializationsMap)[j];
                            formArray.push(this.createSpecializationFormGroupWithValues(Number(key), value));
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

    createDTO() {
        type phase = { name: string, duration: number, specializations: { [key: number]: number } }
        let phasesList: phase[] = [];

        const preparationPhaseSpecializations = this.operationTypeForm.get('preparationPhaseSpecializations') as FormArray;
        let specializationsMap: { [key: number]: number } = {};
        for (let i = 0; i < preparationPhaseSpecializations.length; i++) {
            let spec: number = preparationPhaseSpecializations.at(i).get('specialization')?.value;
            let count: number = preparationPhaseSpecializations.at(i).get('count')?.value;
            specializationsMap[spec] = count;
        }
        phasesList.push({
            name: 'Anesthesia/patient preparation',
            duration: this.operationTypeForm.value.preparationPhaseDuration,
            specializations: specializationsMap
        });

        const surgeryPhaseSpecializations = this.operationTypeForm.get('surgeryPhaseSpecializations') as FormArray;
        specializationsMap = {};
        for (let i = 0; i < surgeryPhaseSpecializations.length; i++) {
            let spec: number = surgeryPhaseSpecializations.at(i).get('specialization')?.value;
            let count: number = surgeryPhaseSpecializations.at(i).get('count')?.value;
            specializationsMap[spec] = count;
        }
        phasesList.push({
            name: 'Surgery',
            duration: this.operationTypeForm.value.surgeryPhaseDuration,
            specializations: specializationsMap
        });

        const cleaningPhaseSpecializations = this.operationTypeForm.get('cleaningPhaseSpecializations') as FormArray;
        specializationsMap = {};
        for (let i = 0; i < cleaningPhaseSpecializations.length; i++) {
            let spec: number = cleaningPhaseSpecializations.at(i).get('specialization')?.value;
            let count: number = cleaningPhaseSpecializations.at(i).get('count')?.value;
            specializationsMap[spec] = count;
        }
        phasesList.push({
            name: 'Cleaning',
            duration: this.operationTypeForm.value.cleaningPhaseDuration,
            specializations: specializationsMap
        });

        const updatingOperationTypeDto = {
            id: this.operationTypeId,
            name: this.operationTypeForm.value.name,
            phases: phasesList
        }
        return updatingOperationTypeDto;
    }

    updateOperationType() {
        this.operationType = this.createDTO();

        if (this.operationType == null) {
            this.toastr.error("Operation type invalid, unexpected error!");
            return;
        }

        this.service.updateOperationType(this.operationType).subscribe({
            next: () => {
                this.toastr.success('Operation type updated successfully', 'Success');
                this.sendToSearch();
            },
            error: (err: HttpErrorResponse) => {
                this.toastr.error('Failed to update operation type\n' + err.error.message, 'Error');
            }
        })
    }

    sendToSearch() {
        this.router.navigate(['/admin/operationtype/search']);
    }
}
