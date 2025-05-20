import { Component, Input, input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AllergyDto } from '../../dto/allergyDto';
import { AllergyService } from '../../services/allergy.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Sort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-search-allergy',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, MatSortModule, RouterOutlet, RouterLink],
    templateUrl: './search-allergy.component.html',
    styleUrl: './search-allergy.component.css'
})
export class SearchAllergyComponent {
    allergyList!: AllergyDto[];
    withFilters: boolean = false;
    filtersForm: FormGroup;

    constructor(private fb: FormBuilder, private service: AllergyService,
        private toastr: ToastrService, private router: Router) {
        this.filtersForm = this.fb.group({
            code: '',
            name: ''
        })
    }

    ngOnInit(): void {
        this.getAllergies();
    }

    sortData(sort: Sort) {
        if (this.allergyList == null) return;
        const data = this.allergyList?.slice();
        if (!sort.active || sort.direction == '') {
            this.allergyList = data;
            return;
        }
        if (data == null) {
            return;
        }
        this.allergyList = data.sort((op1, op2) => {
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

    getAllergies() {
        let code = this.filtersForm.value.code;
        let name = this.filtersForm.value.name;

        this.service.getAllergies(code, name)
            .subscribe({
                next: (resultAllergy) => {
                    if (resultAllergy != null) {
                        this.allergyList = resultAllergy;
                    }
                }
            });
    }

    updateAllergy(allergyDto: AllergyDto) {
        this.router.navigate(['/admin/allergy/update', allergyDto.id]);
    }
}
