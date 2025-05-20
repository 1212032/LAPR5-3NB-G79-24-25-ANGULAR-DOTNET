import { Component, OnInit } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MedicalConditionService } from '../../services/medical-condition.service';
import { CreatingMedicalConditionDto } from '../../dto/creatingMedicalConditionDto';

@Component({
    selector: 'app-create-medical-condition',
    standalone: true,
    templateUrl: './create-medical-condition.component.html',
    imports: [ReactiveFormsModule, CommonModule],
    styleUrl: './create-medical-condition.component.css',
})
export class CreateMedicalConditionComponent implements OnInit {
    medicalConditionForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private service: MedicalConditionService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.medicalConditionForm = this.fb.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            description: ['', Validators.required],
            symptoms: this.fb.array([]),
        });
    }

    get symptoms() {
        return this.medicalConditionForm.get('symptoms') as FormArray;
    }
    private createSymptomsFormGroup(): FormGroup {
        return new FormGroup({
            symptom: new FormControl('', Validators.required),
        });
    }
    addSymptom() {
        const symptoms = this.medicalConditionForm.get('symptoms') as FormArray;
        symptoms.push(this.createSymptomsFormGroup());
    }
    removeSymptom(i: number) {
        this.symptoms.removeAt(i);
    }

    createDto(): CreatingMedicalConditionDto {
        let symptomList: string[] = [];

        this.symptoms.controls.forEach(control => {
            symptomList.push(control.get('symptom')?.value);
        });

        let dto: CreatingMedicalConditionDto = {
            code: this.medicalConditionForm.get('code')?.value,
            name: this.medicalConditionForm.get('name')?.value,
            description: this.medicalConditionForm.get('description')?.value,
            symptoms: symptomList,
        };
        return dto;
    }
    findInvalidForm(): string[] {
        let errors: string[] = [];
        if (this.medicalConditionForm.controls['code'].invalid) {
            errors.push("Please insert code");
        }
        if (this.medicalConditionForm.controls['name'].invalid) {
            errors.push("Please insert name");
        }
        if (this.medicalConditionForm.controls['description'].invalid) {
            errors.push("Please insert description");
        }
        return errors;
    }
    createMedicalCondition() {
        if (this.medicalConditionForm.invalid) {
            this.findInvalidForm().forEach((message) => {
                this.toastr.error(
                    message,
                    'Error'
                );
            })

            return;
        }
        let dto = this.createDto();

        if (dto != null) {
            this.service.createMedicalCondition(dto).subscribe({
                next: () => {
                    this.toastr.success(
                        'Medical condition created successfully',
                        'Success'
                    );
                    this.medicalConditionForm.reset();
                },
                error: (err: HttpErrorResponse) => {
                    this.toastr.error(
                        'Failed to create medical condition\n' + err.error.message,
                        'Error'
                    );
                },
            });
        }
    }
}
