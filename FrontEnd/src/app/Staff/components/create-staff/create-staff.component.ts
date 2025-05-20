import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { StaffService } from '../../services/staff.service';
import { CommonModule } from '@angular/common';
import { SpecializationDto } from '../../dto/specializationDto';
import { CreatingStaffDto } from '../../dto/creatingStaffDto';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-create-staff',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './create-staff.component.html',
    styleUrl: './create-staff.component.css'
})
export class CreateStaffComponent implements OnInit {
    staffForm!: FormGroup;
    staff?: CreatingStaffDto;
    specializations?: SpecializationDto[];

    constructor(private fb: FormBuilder, private service: StaffService, private toastr: ToastrService) { }

    ngOnInit(): void {
        this.staffForm = this.fb.group({
            licenseNumber: ['', Validators.required],
            email: ['', Validators.required],
            phone: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            role: ['', Validators.required],
            availabilitySlots: this.fb.array([this.createSlotFormGroup()]),
            specialization: ['', Validators.required],
        })

        this.getAllSpecializations();
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

    getAllSpecializations() {
        this.service.getAllSpecializations().subscribe({
            next: (resultSpecializations: SpecializationDto[] | null) => {
                if (resultSpecializations != null) {
                    this.specializations = resultSpecializations;
                }
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
        const creatingStaffDto = {
            licenseNumber: this.staffForm.value.licenseNumber,
            email: this.staffForm.value.email,
            phone: this.staffForm.value.phone,
            firstName: this.staffForm.value.firstName,
            lastName: this.staffForm.value.lastName,
            role: this.staffForm.value.role,
            availabilitySlots: availabilitySlotsList,
            specialization: this.staffForm.value.specialization,
        }
        return creatingStaffDto;
    }

    createStaff() {
        this.staff = this.createDto();

        if (this.staff == null)
            return alert("Staff invalid, unexpected error!");

        this.service.createStaff(this.staff).subscribe({
            next: () => {
                this.toastr.success('Staff created successfully', 'Success');
                this.staffForm.reset();

                const availabilitySlotsForm = this.staffForm.get('availabilitySlots') as FormArray;
                for (let i = 1; i < availabilitySlotsForm.length; i++) {
                    availabilitySlotsForm.removeAt(i);
                }
            },
            error: (err: HttpErrorResponse) => {
                this.toastr.error('Failed to create staff\n' + err.error.message, 'Error');
            }
        })
    }
}
