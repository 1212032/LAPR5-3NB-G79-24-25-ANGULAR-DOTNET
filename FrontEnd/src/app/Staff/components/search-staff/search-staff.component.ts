import { Component, Input, input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { StaffDto } from '../../dto/staffDto';
import { StaffSpecializationDto } from '../../dto/staffSpecializationDto';
import { StaffService } from '../../services/staff.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Sort, MatSortModule } from '@angular/material/sort';
import { SpecializationDto } from '../../dto/specializationDto';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-search-staff',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, MatSortModule, RouterOutlet, RouterLink],
    templateUrl: './search-staff.component.html',
    styleUrl: './search-staff.component.css'
})
export class SearchStaffComponent {
    specializations: SpecializationDto[];
    staffList!: StaffSpecializationDto[];
    withFilters: boolean = false;
    filtersForm: FormGroup;
    selectedStaffId: string;
    selectedStaffName: string;

    constructor(private fb: FormBuilder, private service: StaffService,
        public dialog: MatDialog, private toastr: ToastrService, private router: Router) {
        this.specializations = [];
        this.selectedStaffId = "";
        this.selectedStaffName = "";
        this.filtersForm = this.fb.group({
            licenseNumber: '',
            name: '',
            role: '',
            specialization: '',
            active: 'true'
        })
    }

    ngOnInit(): void {
        this.getAllSpecializations();
    }

    sortData(sort: Sort) {
        if (this.staffList == null) return;
        const data = this.staffList?.slice();
        if (!sort.active || sort.direction == '') {
            this.staffList = data;
            return;
        }
        if (data == null) {
            return;
        }
        this.staffList = data.sort((op1, op2) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'licenseNumber':
                    return this.compare(op1.licenseNumber, op2.licenseNumber, isAsc);
                case 'fullName':
                    return this.compare(op1.fullName, op2.fullName, isAsc);
                case 'role':
                    return this.compare(op1.role, op2.role, isAsc);
                case 'specialization':
                    return this.compare(op1.specializationName == null ? "" : op1.specializationName,
                        op2.specializationName == null ? "" : op2.specializationName, isAsc);
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
                    this.getStaff();
                } else {
                    this.toastr.error("Failed to fetch specializations", 'Error');
                }
            },
            error: (err) => {
                this.toastr.error("Failed to fetch specializations", 'Error');
            }
        });
    }

    getStaff() {
        let licenseNumber = this.filtersForm.value.licenseNumber;
        let name = this.filtersForm.value.name;
        let role = this.filtersForm.value.role;
        let specialization = this.filtersForm.value.specialization;
        let active = this.filtersForm.value.active;

        this.service.getStaff(licenseNumber, name, role, specialization, active)
            .subscribe({
                next: (resultStaff) => {
                    if (resultStaff != null) {
                        this.staffList = resultStaff;
                        if (this.staffList != null) {
                            for (let i = 0; i < this.staffList.length; i++) {
                                let specialization: SpecializationDto | undefined;
                                specialization = this.specializations.find(spec => spec.id === this.staffList[i].specialization);
                                if (specialization != null) {
                                    this.staffList[i].specializationName = specialization.name;
                                }
                            }
                        }
                    }
                }
            });
    }

    updateStaff(staffDto: StaffDto) {
        this.router.navigate(['/admin/staff/update', staffDto.id]);
    }

    selectedStaff(selectedStaff: StaffSpecializationDto) {
        this.selectedStaffId = selectedStaff.id;
        this.selectedStaffName = selectedStaff.fullName;
    }

    inactivateStaff() {
        this.service.inactivateStaff(this.selectedStaffId)
            .subscribe({
                next: (response) => {
                    this.toastr.success('Staff inactivated successfully', 'Success');
                    this.getStaff();
                },
                error: (err: HttpErrorResponse) => {
                    this.toastr.error(err.error.message, 'Error');
                }
            });
    }
}
