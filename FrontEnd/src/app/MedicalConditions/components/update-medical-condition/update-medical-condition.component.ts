import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MedicalConditionService } from '../../services/medical-condition.service';
import { MedicalConditionDto } from '../../dto/medicalConditionDto';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-update-medical-condition',
    standalone: true,
    templateUrl: './update-medical-condition.component.html',
    imports: [ReactiveFormsModule, CommonModule],
    styleUrl: './update-medical-condition.component.css',
})
export class UpdateMedicalConditionComponent implements OnInit {
    medicalConditionForm!: FormGroup;
    medicalConditionId: string;

    constructor(private fb: FormBuilder, private service: MedicalConditionService, private toastr: ToastrService,
        private route: ActivatedRoute, private router: Router) {
        this.medicalConditionId = '';
    }

    ngOnInit(): void {
        this.medicalConditionForm = this.fb.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            description: ['', Validators.required],
            symptoms: this.fb.array([]),
        });
        this.route.params.subscribe(params => {
            this.medicalConditionId = params['id'];
            this.getMedicalCondition();
        });
    }

    getMedicalCondition() {
        this.service.getMedicalConditionById(this.medicalConditionId).subscribe({
            next: (resultMedicalCondition: MedicalConditionDto | null) => {
                if (resultMedicalCondition != null) {
                    this.medicalConditionForm.controls['code'].setValue(resultMedicalCondition.code);
                    this.medicalConditionForm.controls['name'].setValue(resultMedicalCondition.name);
                    this.medicalConditionForm.controls['description'].setValue(resultMedicalCondition.description);
                    for (let i = 0; i < resultMedicalCondition.symptoms.length; i++) {
                        this.addSymptom();
                        let group = this.symptoms.at(i) as FormGroup;
                        group.controls['symptom'].setValue(resultMedicalCondition.symptoms[i]);
                    }
                } else {
                    this.toastr.error('Medical condition not found', 'Error');
                    this.sendToSearch();
                }
            },
            error: (err: HttpErrorResponse) => {
                this.toastr.error('Medical condition not found', 'Error');
                this.sendToSearch();
            }
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

    createDto(): MedicalConditionDto {
        let symptomList: string[] = [];
        this.symptoms.controls.forEach(control => {
            symptomList.push(control.get('symptom')?.value);
        });
        let dto: MedicalConditionDto = {
            id: this.medicalConditionId,
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

    updateMedicalCondition() {
        if (this.medicalConditionForm.invalid) {
            this.findInvalidForm().forEach((message) => {
                this.toastr.error(message, 'Error');
            })
            return;
        }

        let dto = this.createDto();
        if (dto != null) {
            this.service.updateMedicalCondition(dto).subscribe({
                next: () => {
                    this.toastr.success('Medical condition updated successfully', 'Success');
                    this.sendToSearch();
                },
                error: (err: HttpErrorResponse) => {
                    this.toastr.error('Failed to update medical condition\n' + err.error.message, 'Error');
                },
            });
        }
    }

    private sendToSearch() {
        this.router.navigate(['/admin/medicalcondition/search']);
    }
}
