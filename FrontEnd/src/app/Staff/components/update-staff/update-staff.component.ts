import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { StaffService } from '../../services/staff.service';
import { CommonModule } from '@angular/common';
import { SpecializationDto } from '../../dto/specializationDto';
import { UpdatingStaffDto } from '../../dto/updatingStaffDto';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffDto } from '../../dto/staffDto';

@Component({
    selector: 'app-update-staff',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './update-staff.component.html',
    styleUrl: './update-staff.component.css'
})
export class UpdateStaffComponent implements OnInit {
    staffForm!: FormGroup;
    staff?: UpdatingStaffDto;
    specializations?: SpecializationDto[];
    staffId: string;

    constructor(private fb: FormBuilder, private service: StaffService, private toastr: ToastrService,
        private route: ActivatedRoute, private router: Router) {
        this.staffId = "";
    }

    async ngOnInit(): Promise<void> {
        this.route.params.subscribe(params => { this.staffId = params['id']; });
        this.staffForm = this.fb.group({
            licenseNumber: ['', Validators.required],
            email: ['', Validators.required],
            phone: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            role: ['', Validators.required],
            availabilitySlots: this.fb.array([]),
            specialization: ['', Validators.required],
        })
        await this.getAllSpecializations();
        this.getStaff();
    }

    get slots() {
        return this.staffForm.get('availabilitySlots') as FormArray;
    }

    addSlot() {
        const availabilitySlots = this.staffForm.get('availabilitySlots') as FormArray;
        availabilitySlots.push(this.createSlotFormGroup());
    }

    removeSlot(i: number) {
        const availabilitySlots = this.staffForm.get('availabilitySlots') as FormArray;
        availabilitySlots.removeAt(i);
    }

    private createSlotFormGroup(): FormGroup {
        return new FormGroup({
            'fromDateTime': new FormControl('', Validators.required),
            'toDateTime': new FormControl('', Validators.required)
        })
    }

    private createSlotFormGroupWithValues(fromDateTime: Date, toDateTime: Date): FormGroup {
        return new FormGroup({
            'fromDateTime': new FormControl(fromDateTime, Validators.required),
            'toDateTime': new FormControl(toDateTime, Validators.required)
        })
    }

    async getAllSpecializations() {
        this.service.getAllSpecializations().subscribe({
            next: (resultSpecializations: SpecializationDto[] | null) => {
                if (resultSpecializations != null) {
                    this.specializations = resultSpecializations;
                }
            },
            error: (err: HttpErrorResponse) => {
                this.toastr.error('Specialization not found', 'Error');
                this.sendToSearch();
            }
        });
    }

    getStaff() {
        this.service.getStaffById(this.staffId).subscribe({
            next: (resultStaff: StaffDto | null) => {
                if (resultStaff != null) {
                    this.staffForm.controls['licenseNumber'].setValue(resultStaff.licenseNumber);
                    this.staffForm.controls['email'].setValue(resultStaff.email);
                    this.staffForm.controls['phone'].setValue(resultStaff.phone);
                    this.staffForm.controls['firstName'].setValue(resultStaff.firstName);
                    this.staffForm.controls['lastName'].setValue(resultStaff.lastName);
                    this.staffForm.controls['role'].setValue(resultStaff.role);
                    this.staffForm.controls['specialization'].setValue(resultStaff.specialization);

                    let formArray = this.staffForm.get('availabilitySlots') as FormArray;
                    if(resultStaff.availabilitySlots!=null){
                        for (let i = 0; i < resultStaff.availabilitySlots.length; i++) {
                            formArray.push(this.createSlotFormGroupWithValues(
                                resultStaff.availabilitySlots[i].item1,
                                resultStaff.availabilitySlots[i].item2,
                            ));
                        }
                    }
                    
                } else {
                    this.toastr.error('Staff not found', 'Error');
                    this.sendToSearch();
                }
            },
            error: (err: HttpErrorResponse) => {
                this.toastr.error('Staff not found', 'Error');
                this.sendToSearch();
            }
        });
    }


    createDto() {
        type slot = { item1: Date, item2: Date }
        const availabilitySlotsForm = this.staffForm.get('availabilitySlots') as FormArray;
        let availabilitySlotsList: slot[] = [];
        for (let i = 0; i < availabilitySlotsForm.length; i++) {
            availabilitySlotsList.push({ item1: availabilitySlotsForm.at(i).get('fromDateTime')?.value, item2: availabilitySlotsForm.at(i).get('toDateTime')?.value });
        }
        const updatingStaffDto = {
            id: this.staffId,
            licenseNumber: this.staffForm.value.licenseNumber,
            email: this.staffForm.value.email,
            phone: this.staffForm.value.phone,
            firstName: this.staffForm.value.firstName,
            lastName: this.staffForm.value.lastName,
            role: this.staffForm.value.role,
            availabilitySlots: availabilitySlotsList,
            specialization: this.staffForm.value.specialization,
        }
        return updatingStaffDto;
    }

    updateStaff() {
        this.staff = this.createDto();

        if (this.staff == null)
            return alert("Staff invalid, unexpected error!");

        this.service.updateStaff(this.staff).subscribe({
            next: () => {
                this.toastr.success('Staff updated successfully', 'Success');
                this.sendToSearch();
            },
            error: (err: HttpErrorResponse) => {
                this.toastr.error('Failed to update staff\n' + err.error.message, 'Error');
            }
        })
    }

    private sendToSearch() {
        this.router.navigate(['/admin/staff/search']);
    }
}
