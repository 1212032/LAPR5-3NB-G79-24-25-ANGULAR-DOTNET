import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { UpdatePatientUserComponent } from './update-patient-user.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PatientUserService } from '../../services/patientUser.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { PatientDto } from '../../dto/patientDto';
import { PatientRequestDto } from '../../dto/patientRequestDto';

describe('UpdatePatientUserComponent', () => {
    let component: UpdatePatientUserComponent;
    let fixture: ComponentFixture<UpdatePatientUserComponent>;
    let patientUserService: any;
    let toastrService: any;

    beforeEach(async () => {
        patientUserService = {
            getPatient: jasmine.createSpy('getPatient').and.returnValue(of({})),
            sendPatientRequest: jasmine.createSpy('sendPatientRequest').and.returnValue(of({}))
        };
        toastrService = {
            error: jasmine.createSpy('error'),
            success: jasmine.createSpy('success')
        };

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, CommonModule],
            providers: [
                FormBuilder,
                { provide: PatientUserService, useValue: patientUserService },
                { provide: ToastrService, useValue: toastrService },
                provideHttpClient()
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(UpdatePatientUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should load patient data on initialization', fakeAsync(() => {
        const mockPatient: PatientDto = {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '123456789',
            emergencyContact: 'Jane Doe',
            address: '123 Main St',
            dateOfBirth: new Date(1990, 1, 1),
            gender: 'Male',
            medicalRecord: 'MR123',
        };

        patientUserService.getPatient.and.returnValue(of(mockPatient));
        component.ngOnInit();
        tick();

        expect(patientUserService.getPatient).toHaveBeenCalled();
        expect(component.currentPatientId).toBe('1');
        expect(component.patientForm.value.firstName).toBe('John');
        expect(component.patientForm.value.lastName).toBe('Doe');
        expect(component.patientForm.value.phone).toBe('123456789');
        expect(component.patientForm.value.emergencyContact).toBe('Jane Doe');
        expect(component.patientForm.value.address).toBe('123 Main St');
    }));

    it('should display error message if patient data fails to load', fakeAsync(() => {
        const mockError = new HttpErrorResponse({
            error: { message: 'Patient not found' },
            status: 404,
        });

        patientUserService.getPatient.and.returnValue(throwError(mockError));
        component.ngOnInit();

        expect(patientUserService.getPatient).toHaveBeenCalled();
        expect(toastrService.error).toHaveBeenCalledWith('Profile not found\nPatient not found', 'Error');
    }));

    it('should create a valid DTO from form values', () => {
        component.patientForm.patchValue({
            firstName: 'John',
            lastName: 'Doe',
            emergencyContact: 'Jane Doe',
            phone: '123456789',
            address: '123 Main St',
            email: 'mail@mail.com'
        });

        const dto = component.createDto();
        expect(dto).toEqual({
            requestType: 'Update',
            firstName: 'John',
            lastName: 'Doe',
            emergencyContact: 'Jane Doe',
            phone: '123456789',
            address: '123 Main St',
            email: 'mail@mail.com'
        } as PatientRequestDto);
    });

    it('should request update', fakeAsync(() => {
        const dto2: PatientRequestDto = {
            id: 1,
            requestType: 'Update',
            firstName: 'John',
            lastName: 'Doe',
            emergencyContact: 'Jane Doe',
            phone: '123456789',
            address: '123 Main St',
            email: 'mail@mail.com',
            requestedBy: '',
            requestDateTime: new Date(2025, 1, 1),
            requestDateTimeString: new Date(2025, 1, 1).toString()
        }
        patientUserService.sendPatientRequest.and.returnValue(of(dto2));

        component.currentPatientId = '1';
        component.patientForm.patchValue({
            firstName: 'John',
            lastName: 'Doe',
            emergencyContact: 'Jane Doe',
            phone: '123456789',
            address: '123 Main St',
            email: 'mail@mail.com'
        });

        component.requestPatientUpdate();
        tick();

        expect(patientUserService.sendPatientRequest).toHaveBeenCalledWith({
            requestType: 'Update',
            firstName: 'John',
            lastName: 'Doe',
            emergencyContact: 'Jane Doe',
            phone: '123456789',
            address: '123 Main St',
            email: 'mail@mail.com'
        });
        expect(toastrService.success).toHaveBeenCalledWith('Profile update successfully requested', 'Success');
    }));

    it('should display error message if request fails', fakeAsync(() => {
        const mockError = new HttpErrorResponse({
            error: { message: 'Update failed' },
            status: 500,
        });

        patientUserService.sendPatientRequest.and.returnValue(throwError(mockError));
        component.currentPatientId = '1';
        component.patientForm.patchValue({
            firstName: 'John',
            lastName: 'Doe',
            emergencyContact: 'Jane Doe',
            phone: '123456789',
            address: '123 Main St',
            email: 'mail@mail.com'
        });

        component.requestPatientUpdate();

        expect(patientUserService.sendPatientRequest).toHaveBeenCalled();
        expect(toastrService.error).toHaveBeenCalledWith('Failed to request profile update\nUpdate failed', 'Error');
    }));

});
