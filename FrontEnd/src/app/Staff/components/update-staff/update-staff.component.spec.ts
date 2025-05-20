import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UpdateStaffComponent } from './update-staff.component';
import { StaffService } from '../../services/staff.service';
import { ToastrService } from 'ngx-toastr';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { StaffDto } from '../../dto/staffDto';

describe('UpdateStaffComponent', () => {
    let component: UpdateStaffComponent;
    let fixture: ComponentFixture<UpdateStaffComponent>;
    let mockService: any;
    let mockToastrService: any;
    let mockActivatedRoute: any;
    let mockRouter: any;

    beforeEach(async () => {
        mockService = {
            getAllSpecializations: jasmine.createSpy('getAllSpecializations').and.returnValue(of([])),
            getStaffById: jasmine.createSpy('getStaffById').and.returnValue(of({})),
            updateStaff: jasmine.createSpy('updateStaff').and.returnValue(of({})),
        };
        mockToastrService = {
            error: jasmine.createSpy('error'),
            success: jasmine.createSpy('success')
        };

        mockActivatedRoute = {
            params: of({ id: 1 })
        };

        mockRouter = {
            navigate: jasmine.createSpy('navigate')
        };

        await TestBed.configureTestingModule({
            imports: [UpdateStaffComponent, ReactiveFormsModule],
            providers: [
                { provide: ToastrService, useValue: mockToastrService },
                { provide: StaffService, useValue: mockService },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: Router, useValue: mockRouter },
                provideHttpClient(),
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UpdateStaffComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should call getAllSpecializations on init', async () => {
        spyOn(component, 'ngOnInit').and.callThrough();

        await component.ngOnInit();
        expect(mockService.getAllSpecializations).toHaveBeenCalled();
    });
    it('should call getStaffById on init', () => {
        spyOn(component, 'ngOnInit').and.callThrough();

        component.ngOnInit();
        expect(mockService.getStaffById).toHaveBeenCalled();
    });

    it('should handle error when getAllSpecializations fails', async () => {
        mockService.getAllSpecializations.and.returnValue(throwError({ error: { message: '' } }));
        await component.getAllSpecializations();
        expect(mockToastrService.error).toHaveBeenCalledWith('Specialization not found', 'Error');
    });

    it('should handle error when getStaffById fails', async () => {
        mockService.getStaffById.and.returnValue(throwError({ error: { message: '' } }));
        await component.getStaff();
        expect(mockToastrService.error).toHaveBeenCalledWith('Staff not found', 'Error');
    });

    it('should update form on getStaffById success', async () => {
        type slot = { item1: Date, item2: Date };

        const availabilitySlotsList: slot[] = [{
            item1: new Date('2023-10-01T08:00:00'),
            item2: new Date('2023-10-01T16:00:00')
        }];

        const staffDto: StaffDto = {
            id: '1',
            licenseNumber: 'MR123',
            email: 'email@email.com',
            phone: '918194918',
            firstName: 'Jose',
            lastName: 'Silva',
            role: 'Admin',
            availabilitySlots: availabilitySlotsList,
            specialization: 1,
            active: true,
            fullName: ''
        };

        mockService.getStaffById.and.returnValue(of(staffDto));

        component.getStaff();

        fixture.detectChanges();

        expect(component.staffForm.value).toEqual({
            licenseNumber: 'MR123',
            email: 'email@email.com',
            phone: '918194918',
            firstName: 'Jose',
            lastName: 'Silva',
            role: 'Admin',
            availabilitySlots: [{
                fromDateTime: availabilitySlotsList[0].item1,
                toDateTime: availabilitySlotsList[0].item2
            }],
            specialization: 1,
        });
    });

    it('should handle error when update staff fails', () => {
        mockService.updateStaff.and.returnValue(throwError({ error: { message: 'Error' } }));
        component.updateStaff();
        expect(mockToastrService.error).toHaveBeenCalledWith('Failed to update staff\nError', 'Error');
    });

    it('should navigate to search on update success', () => {
        type slot = { item1: Date, item2: Date };

        const availabilitySlotsList: slot[] = [{
            item1: new Date('2023-10-01T08:00:00'),
            item2: new Date('2023-10-01T16:00:00')
        }];

        const availabilitySlotsFormArray = component.staffForm.get('availabilitySlots') as FormArray;
        availabilitySlotsFormArray.push(component['createSlotFormGroupWithValues'](
            availabilitySlotsList[0].item1,
            availabilitySlotsList[0].item2
        ));

        component.staffForm.patchValue({
            licenseNumber: 'MR123',
            email: 'email@email.com',
            phone: '918194918',
            firstName: 'Jose',
            lastName: 'Silva',
            role: 'Admin',
            specialization: 1,
        });
        component.updateStaff();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/staff/search']);
    });

});