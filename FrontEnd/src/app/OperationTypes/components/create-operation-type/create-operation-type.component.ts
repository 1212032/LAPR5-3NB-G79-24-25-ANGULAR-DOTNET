import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { OperationTypeService } from '../../services/operationType.service';
import { CommonModule } from '@angular/common';
import { SpecializationDto } from '../../../Staff/dto/specializationDto';
import { CreatingOperationTypeDto } from '../../dto/creatingOperationTypeDto';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-create-operation-type',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './create-operation-type.component.html',
    styleUrl: './create-operation-type.component.css'
})
export class CreateOperationTypeComponent implements OnInit {
    operationTypeForm!: FormGroup;
    operationType?: CreatingOperationTypeDto;
    specializations?: SpecializationDto[];

    constructor(private fb: FormBuilder, private service: OperationTypeService, private toastr: ToastrService) { }

    ngOnInit(): void {
        this.operationTypeForm = this.fb.group({
            name: ['', Validators.required],
            preparationPhaseDuration: ['', Validators.required],
            preparationPhaseSpecializations: this.fb.array([this.createSpecializationFormGroup()]),
            surgeryPhaseDuration: ['', Validators.required],
            surgeryPhaseSpecializations: this.fb.array([this.createSpecializationFormGroup()]),
            cleaningPhaseDuration: ['', Validators.required],
            cleaningPhaseSpecializations: this.fb.array([this.createSpecializationFormGroup()]),
        })
        this.getAllSpecializations();
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

    getAllSpecializations() {
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

        const creatingOperationTypeDto = {
            name: this.operationTypeForm.value.name,
            phases: phasesList
        }
        return creatingOperationTypeDto;
    }

    createOperationType() {
        this.operationType = this.createDTO();

        if (this.operationType == null)
            return alert("Operation type invalid, unexpected error!");

        this.service.createOperationType(this.operationType).subscribe({
            next: () => {
                this.toastr.success('Operation type created successfully', 'Success');
                this.operationTypeForm.reset();

                const preparationPhaseSpecializations = this.operationTypeForm.get('preparationPhaseSpecializations') as FormArray;
                for (let i = 1; i < preparationPhaseSpecializations.length; i++) {
                    preparationPhaseSpecializations.removeAt(i);
                }
                const surgeryPhaseSpecializations = this.operationTypeForm.get('surgeryPhaseSpecializations') as FormArray;
                for (let i = 1; i < surgeryPhaseSpecializations.length; i++) {
                    surgeryPhaseSpecializations.removeAt(i);
                }
                const cleaningPhaseSpecializations = this.operationTypeForm.get('cleaningPhaseSpecializations') as FormArray;
                for (let i = 1; i < cleaningPhaseSpecializations.length; i++) {
                    cleaningPhaseSpecializations.removeAt(i);
                }
            },
            error: (err: HttpErrorResponse) => {
                this.toastr.error('Failed to create operation type\n' + err.error.message, 'Error');
            }
        })
    }
}
