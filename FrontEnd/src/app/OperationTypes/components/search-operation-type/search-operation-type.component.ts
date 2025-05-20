import { Component, Input, input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { OperationTypeDto } from '../../dto/operationTypeDto';
import { OperationTypeService } from '../../services/operationType.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Sort, MatSortModule } from '@angular/material/sort';
import { SpecializationDto } from '../../../Staff/dto/specializationDto';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-search-operation-type',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, MatSortModule, RouterOutlet, RouterLink],
    templateUrl: './search-operation-type.component.html',
    styleUrl: './search-operation-type.component.css'
})
export class SearchOperationTypeComponent {
    operationTypeList?: OperationTypeDto[];
    specializations?: SpecializationDto[];
    withFilters: boolean = false;
    filtersForm: FormGroup;
    selectedOperationTypeId: number;
    selectedOperationTypeName: string;

    constructor(private fb: FormBuilder, private service: OperationTypeService,
        public dialog: MatDialog, private toastr: ToastrService, private router: Router) {
        this.selectedOperationTypeId = 0;
        this.selectedOperationTypeName = "";
        this.filtersForm = this.fb.group({
            name: '',
            specialization: '',
            active: true
        })
    }

    ngOnInit(): void {
        this.getAllSpecializations();
    }

    sortData(sort: Sort) {
        if (this.operationTypeList == null) return;
        const data = this.operationTypeList?.slice();
        if (!sort.active || sort.direction == '') {
            this.operationTypeList = data;
            return;
        }
        if (data == null) {
            return;
        }
        this.operationTypeList = data.sort((op1, op2) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'name':
                    return this.compare(op1.name, op2.name, isAsc);
                case 'preparationduration':
                    return this.compare(op1.phases[0].duration, op2.phases[0].duration, isAsc);
                case 'surgeryduration':
                    return this.compare(op1.phases[1].duration, op2.phases[1].duration, isAsc);
                case 'cleaningduration':
                    return this.compare(op1.phases[2].duration, op2.phases[2].duration, isAsc);
                case 'active':
                    return this.compare(op1.active ? 1 : 0, op2.active ? 1 : 0, isAsc);
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

    getAllSpecializations() {
        this.service.getAllSpecializations().subscribe({
            next: (resultSpecializations) => {
                if (resultSpecializations != null) {
                    this.specializations = resultSpecializations;
                    this.getOperationTypes();
                } else {
                    this.toastr.error("Failed to fetch specializations", 'Error');
                }
            },
            error: (err) => {
                this.toastr.error("Failed to fetch specializations", 'Error');
            }
        });
    }

    getOperationTypes() {
        if (!this.service) {
            this.toastr.error('Service is not available', 'Error');
            return;
        }
        let name: string = this.filtersForm?.value?.name || '';
        let specialization: number = this.filtersForm?.value?.specialization || 0;
        let active: boolean = this.filtersForm?.value.active;
        
        this.service.getOperationTypes(name, specialization, active)
            .subscribe({
                next: (resultOperationType) => {
                    if (resultOperationType != null) {
                        this.arrangeOperationTypes(resultOperationType);
                    }
                }
            });
    }

    private arrangeOperationTypes(resultOperationType: OperationTypeDto[]) {
        for (let i = 0; i < resultOperationType.length; i++) {
            if (resultOperationType[i].phases.length == 1) {
                if (resultOperationType[i].phases[0].name.includes('Anesthesia')) {
                    resultOperationType[i].phases.push({ name: '', duration: 0, specializations: { [0]: 0 } });
                    resultOperationType[i].phases.push({ name: '', duration: 0, specializations: { [0]: 0 } });
                } else {
                    if (resultOperationType[i].phases[0].name.includes('Surgery')) {
                        resultOperationType[i].phases.splice(0, 0, { name: '', duration: 0, specializations: { [0]: 0 } });
                        resultOperationType[i].phases.push({ name: '', duration: 0, specializations: { [0]: 0 } });
                    } else {
                        if (resultOperationType[i].phases[0].name.includes('Cleaning')) {
                            resultOperationType[i].phases.splice(0, 0, { name: '', duration: 0, specializations: { [0]: 0 } });
                            resultOperationType[i].phases.splice(0, 0, { name: '', duration: 0, specializations: { [0]: 0 } });
                        }
                    }
                }
            } else {
                if (resultOperationType[i].phases.length == 2) {
                    if (resultOperationType[i].phases[0].name.includes('Anesthesia') && resultOperationType[i].phases[1].name.includes('Surgery')) {
                        resultOperationType[i].phases.push({ name: '', duration: 0, specializations: { [0]: 0 } });
                    } else {
                        if (resultOperationType[i].phases[0].name.includes('Surgery') && resultOperationType[i].phases[1].name.includes('Cleaning')) {
                            resultOperationType[i].phases.splice(0, 0, { name: '', duration: 0, specializations: { [0]: 0 } });
                        } else {
                            if (resultOperationType[i].phases[0].name.includes('Anesthesia') && resultOperationType[i].phases[0].name.includes('Cleaning')) {
                                resultOperationType[i].phases.splice(1, 0, { name: '', duration: 0, specializations: { [0]: 0 } });
                            }
                        }
                    }
                }
            }
        }
        this.operationTypeList = resultOperationType;
    }

    updateOperationType(operationTypeDto: OperationTypeDto) {
        this.router.navigate(['/admin/operationtype/update', operationTypeDto.id]);
    }


    selectedOperationType(selectedOperationType: OperationTypeDto) {
        this.selectedOperationTypeId = selectedOperationType.id;
        this.selectedOperationTypeName = selectedOperationType.name;
    }

    inactivateOperationType() {
        this.service.inactivateOperationType(this.selectedOperationTypeId)
            .subscribe({
                next: (response) => {
                    this.toastr.success('Operation type inactivated successfully', 'Success');
                    this.getOperationTypes();
                },
                error: (err: HttpErrorResponse) => {
                    this.toastr.error(err.error.message, 'Error');
                }
            });
    }
}
