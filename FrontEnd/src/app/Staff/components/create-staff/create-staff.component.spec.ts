import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateStaffComponent } from './create-staff.component';
import { provideHttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { StaffService } from '../../services/staff.service';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';


describe('CreateStaffComponent', () => {
    let component: CreateStaffComponent;
    let fixture: ComponentFixture<CreateStaffComponent>;
    let mockService: any;
    let mockToastr: any;

    beforeEach(async () => {
        mockService = {
            createStaff: jasmine.createSpy('createStaff').and.returnValue(of([])),
            getAllSpecializations: jasmine.createSpy('getAllSpecializations').and.returnValue(of([])),
        };

        mockToastr = {
            error: jasmine.createSpy('error'),
            success: jasmine.createSpy('success')
        };

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, CommonModule],
            providers: [
                { provide: StaffService, useValue: mockService },
                { provide: ToastrService, useValue: mockToastr },
                provideHttpClient()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CreateStaffComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call getAllSpecializations on init', () => {
        spyOn(component, 'ngOnInit').and.callThrough();

        component.ngOnInit();
        expect(mockService.getAllSpecializations).toHaveBeenCalled();
    });
    it('should initialize form with default values', () => {
        expect(component.staffForm).toBeDefined();
        expect(component.staffForm.controls['email'].value).toBe('');
        expect(component.staffForm.controls['firstName'].value).toBe('');
        expect(component.staffForm.controls['lastName'].value).toBe('');
        expect(component.staffForm.controls['role'].value).toBe('');

        let obj = {
            'fromDateTime': '',
            'toDateTime': ''
        }
        expect(component.staffForm.controls['availabilitySlots'].value).toEqual([obj]);
        expect(component.staffForm.controls['specialization'].value).toBe('');
    });
    it('should update form with values', () => {
        let availabilitySlot = {
            'fromDateTime': '2024-01-01',
            'toDateTime': '2024-01-03'
        }
        component.staffForm.setValue({
            licenseNumber: 'MR123',
            email: 'email@email.com',
            phone: '918194918',
            firstName: 'Jose',
            lastName: 'Silva',
            role: 'Admin',
            availabilitySlots: [availabilitySlot],
            specialization: 'Orthopedist',
        });
        

        expect(component.staffForm.controls['licenseNumber'].value).toBe('MR123');
        expect(component.staffForm.controls['email'].value).toBe('email@email.com');
        expect(component.staffForm.controls['firstName'].value).toBe('Jose');
        expect(component.staffForm.controls['lastName'].value).toBe('Silva');
        expect(component.staffForm.controls['role'].value).toBe('Admin');
        expect(component.staffForm.controls['availabilitySlots'].value).toEqual([availabilitySlot]);
        expect(component.staffForm.controls['specialization'].value).toBe('Orthopedist');
    });

    it('should create staff dto', () => {
        let availabilitySlot = {
            'fromDateTime': new Date(2024, 1, 1),
            'toDateTime': new Date(2024, 1, 3)
        }
        component.staffForm.setValue({
            licenseNumber: 'MR123',
            email: 'email@email.com',
            phone: '918194918',
            firstName: 'Jose',
            lastName: 'Silva',
            role: 'Admin',
            availabilitySlots: [availabilitySlot],
            specialization: 1,
        });

        const dto = component.createDto();

        type slot = { item1: Date, item2: Date }

        const availabilitySlotsForm = component.staffForm.get('availabilitySlots') as FormArray;

        let availabilitySlotsList: slot[] = [{
            item1: new Date(availabilitySlotsForm.at(0).get('fromDateTime')?.value),
            item2: new Date(availabilitySlotsForm.at(0).get('toDateTime')?.value)
        }];
        expect(dto).toEqual({
            licenseNumber: 'MR123',
            email: 'email@email.com',
            phone: '918194918',
            firstName: 'Jose',
            lastName: 'Silva',
            role: 'Admin',
            availabilitySlots: availabilitySlotsList,
            specialization: 1,
        });
    });
    it('should call createStaff on form submit', () => {
        spyOn(component, 'createStaff').and.callThrough();

        let availabilitySlot = {
            'fromDateTime': new Date(2024, 1, 1),
            'toDateTime': new Date(2024, 1, 3)
        }
        component.staffForm.setValue({
            licenseNumber: 'MR123',
            email: 'email@email.com',
            phone: '918194918',
            firstName: 'Jose',
            lastName: 'Silva',
            role: 'Admin',
            availabilitySlots: [availabilitySlot],
            specialization: 'Orthopedist',
        });
        component.createStaff();

        type slot = { item1: Date, item2: Date }

        let availabilitySlotsList: slot[] = [{
            item1: new Date(2024, 1, 1),
            item2: new Date(2024, 1, 3)
        }];

        expect(component.createStaff).toHaveBeenCalled;
        expect(mockService.createStaff).toHaveBeenCalledWith({
            licenseNumber: 'MR123',
            email: 'email@email.com',
            phone: '918194918',
            firstName: 'Jose',
            lastName: 'Silva',
            role: 'Admin',
            availabilitySlots: availabilitySlotsList,
            specialization: 'Orthopedist',
        });
    });

    it('should show success toastr on successful staff creation', () => {
        spyOn(component, 'createStaff').and.callThrough();

        let availabilitySlot = {
            'fromDateTime': new Date(2024, 1, 1),
            'toDateTime': new Date(2024, 1, 3)
        }
        component.staffForm.setValue({
            licenseNumber: 'MR123',
            email: 'email@email.com',
            phone: '918194918',
            firstName: 'Jose',
            lastName: 'Silva',
            role: 'Admin',
            availabilitySlots: [availabilitySlot],
            specialization: 'Orthopedist',
        });
        component.createStaff();

        expect(mockToastr.success).toHaveBeenCalledWith('Staff created successfully', 'Success');
    });
    it('should show error toastr on invalid staff creation', ()=>{
        mockService.createStaff.and.returnValue(throwError({ error: { message: 'Error' } }))
        component.createStaff();

        expect(mockToastr.error).toHaveBeenCalledWith('Failed to create staff\nError', 'Error');
    });
});
