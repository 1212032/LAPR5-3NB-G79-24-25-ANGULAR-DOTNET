import { Component, Input, input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MedicalConditionDto } from '../../dto/medicalConditionDto';
import { MedicalConditionService } from '../../services/medical-condition.service';
import { CommonModule } from '@angular/common';
import { Sort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
    selector: 'app-search-medical-condition',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, MatSortModule, RouterOutlet, RouterLink],
    templateUrl: './search-medical-condition.component.html',
    styleUrl: './search-medical-condition.component.css'
})
export class SearchMedicalConditionComponent {
    medicalConditionList!: MedicalConditionDto[];
    filtersForm: FormGroup;

    constructor(private fb: FormBuilder, private service: MedicalConditionService, private router: Router) {
        this.filtersForm = this.fb.group({
            code: '',
            name: ''
        })
    }

    ngOnInit(): void {
        this.getMedicalConditions();
    }

    sortData(sort: Sort) {
        if (this.medicalConditionList == null) return;
        const data = this.medicalConditionList?.slice();
        if (!sort.active || sort.direction == '') {
            this.medicalConditionList = data;
            return;
        }
        if (data == null) {
            return;
        }
        this.medicalConditionList = data.sort((op1, op2) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'code':
                    return this.compare(op1.code, op2.code, isAsc);
                case 'name':
                    return this.compare(op1.name, op2.name, isAsc);
                default:
                    return 0;
            }
        });
    }

    compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
        if (a instanceof Date && b instanceof Date) {
            return (a.getTime() - b.getTime()) * (isAsc ? 1 : -1);
        } else if (typeof a === 'string' && typeof b === 'string') {
            return a.localeCompare(b) * (isAsc ? 1 : -1);
        } else if (typeof a === 'number' && typeof b === 'number') {
            return (a - b) * (isAsc ? 1 : -1);
        } else {
            return 0;
        }
    }

    getMedicalConditions() {
        let code = this.filtersForm.value.code;
        let name = this.filtersForm.value.name;
        this.service.getMedicalConditions(code, name)
            .subscribe({
                next: (resultMedicalConditions) => {
                    if (resultMedicalConditions != null) {
                        this.medicalConditionList = resultMedicalConditions;
                    }
                }
            });
    }

    updateMedicalCondition(medicalConditionDto: MedicalConditionDto) {
        this.router.navigate(['/admin/medicalcondition/update', medicalConditionDto.id]);
    }
}
