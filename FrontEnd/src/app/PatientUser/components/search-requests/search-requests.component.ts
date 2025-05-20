import { Component, Input, input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Sort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PatientRequestDto } from '../../dto/patientRequestDto';
import { PatientUserService } from '../../services/patientUser.service';
import { MatCell, MatHeaderCell, MatHeaderRow, MatRow, MatTable, MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-search-requests',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, MatSortModule, RouterOutlet, RouterLink,
        MatRow, MatHeaderRow, MatCell, MatHeaderCell, MatTable, MatTableModule],
    templateUrl: './search-requests.component.html',
    styleUrl: './search-requests.component.css'
})
export class SearchRequestsComponent {
    requestsList!: PatientRequestDto[];
    withFilters: boolean = false;
    selectedRequestId: number;
    displayedColumns: string[] = ['requestDateTime'];

    constructor(private fb: FormBuilder, private service: PatientUserService,
        public dialog: MatDialog, private toastr: ToastrService, private router: Router) {
        this.selectedRequestId = 0;
    }

    ngOnInit(): void {
        this.getRequests();
    }

    sortData(sort: Sort) {
        if (this.requestsList == null) return;
        const data = this.requestsList?.slice();
        if (!sort.active || sort.direction == '') {
            this.requestsList = data;
            return;
        }
        if (data == null) {
            return;
        }
        this.requestsList = data.sort((op1, op2) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'requestDateTime':
                    return this.compare(op1.requestDateTime, op2.requestDateTime, isAsc);
                case 'requestType':
                    return this.compare(op1.requestType, op2.requestType, isAsc);
                case 'requestedBy':
                    return this.compare(op1.requestedBy, op2.requestedBy, isAsc);
                case 'firstName':
                    return this.compare(op1.firstName, op2.firstName, isAsc);
                case 'lastName':
                    return this.compare(op1.lastName, op2.lastName, isAsc);
                case 'emergencyContact':
                    return this.compare(op1.emergencyContact, op2.emergencyContact, isAsc);
                case 'phone':
                    return this.compare(op1.phone, op2.phone, isAsc);
                case 'address':
                    return this.compare(op1.address, op2.address, isAsc);
                case 'email':
                    return this.compare(op1.email, op2.email, isAsc);
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

    getRequests() {
        this.service.getRequests()
            .subscribe({
                next: (resultRequests: PatientRequestDto[] | null) => {
                    if (resultRequests != null) {
                        this.requestsList = [];
                        for (let i = 0; i < resultRequests.length; i++) {
                            let dateTime = resultRequests[i].requestDateTime.toString();
                            dateTime = dateTime.substring(8, 10) + "/" + dateTime.substring(5, 7) + "/"
                                + dateTime.substring(0, 4) + " " + dateTime.substring(11, 13) + ":"
                                + dateTime.substring(14, 16) + ":" + dateTime.substring(17, 19);
                            resultRequests[i].requestDateTimeString = dateTime;
                            this.requestsList.push(resultRequests[i]);
                        }
                    }
                }
            });
    }

    selectedRequest(selectedRequest: PatientRequestDto) {
        this.selectedRequestId = selectedRequest.id;
    }

    deleteRequest() {
        this.service.deleteRequest(this.selectedRequestId)
            .subscribe({
                next: (response: PatientRequestDto) => {
                    this.toastr.success('Patient request deleted successfully', 'Success');
                    this.getRequests();
                },
                error: (err: HttpErrorResponse) => {
                    this.toastr.error(err.error.message, 'Error');
                }
            });
    }
}
