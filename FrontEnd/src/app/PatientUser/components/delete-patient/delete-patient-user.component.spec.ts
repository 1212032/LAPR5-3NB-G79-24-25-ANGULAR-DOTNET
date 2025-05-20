import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DeletePatientUserComponent } from './delete-patient-user.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PatientUserService } from '../../services/patientUser.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageDto } from '../../dto/messageDto';
import { PatientDto } from '../../dto/patientDto';

describe('DeletePatientUserComponent', () => {
    let component: DeletePatientUserComponent;
    let fixture: ComponentFixture<DeletePatientUserComponent>;
    let patientUserService: any;
    let toastrService: jasmine.SpyObj<ToastrService>;

    beforeEach(async () => {
        patientUserService = {
            getPatient: jasmine.createSpy('getPatient').and.returnValue(of({})),
            sendPatientRequest: jasmine.createSpy('sendPatientRequest').and.returnValue(of({}))
        };
        toastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, CommonModule],
            providers: [
                FormBuilder,
                { provide: PatientUserService, useValue: patientUserService },
                { provide: ToastrService, useValue: toastrService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DeletePatientUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch patient on initialization', fakeAsync(() => {
        const mockPatient: PatientDto = {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            emergencyContact: '',
            gender: '',
            dateOfBirth: new Date(),
            phone: '',
            address: '',
            medicalRecord: ''
        };

        patientUserService.getPatient.and.returnValue(of(mockPatient));
        component.ngOnInit();
        tick();

        expect(patientUserService.getPatient).toHaveBeenCalled();
        expect(component.patientFound).toBeTrue();
    }));

    it('should show error message if patient not found', fakeAsync(() => {
        patientUserService.getPatient.and.returnValue(of());
        component.ngOnInit();
        tick();

        expect(patientUserService.getPatient).toHaveBeenCalled();
        expect(component.patientFound).toBeFalse();
    }));

    it('should handle error when fetching patient fails', fakeAsync(() => {
        const mockError = new HttpErrorResponse({
            error: { message: 'Server error' },
            status: 500,
        });

        patientUserService.getPatient.and.returnValue(throwError(mockError));
        component.ngOnInit();
        tick();

        expect(patientUserService.getPatient).toHaveBeenCalled();
        expect(toastrService.error).toHaveBeenCalledWith('Profile not found\nServer error', 'Error');
        expect(component.patientFound).toBeFalse();
    }));

    it('should delete patient successfully', fakeAsync(() => {
        const mockMessage: MessageDto = {
            message: 'Profile deletion successfully requested',
        };

        patientUserService.sendPatientRequest.and.returnValue(of(mockMessage));
        component.requestPatientDeletion();
        tick();

        expect(patientUserService.sendPatientRequest).toHaveBeenCalled();
        expect(toastrService.success).toHaveBeenCalledWith('Profile deletion successfully requested', 'Success');
        expect(component.patientFound).toBeFalse();
    }));

    it('should handle error when deleting patient fails', fakeAsync(() => {
        const mockError = new HttpErrorResponse({
            error: { message: 'Delete failed' },
            status: 500,
        });

        patientUserService.sendPatientRequest.and.returnValue(throwError(mockError));
        component.requestPatientDeletion();

        expect(patientUserService.sendPatientRequest).toHaveBeenCalled();
        expect(toastrService.error).toHaveBeenCalledWith('Failed to request profile deletion\nDelete failed', 'Error');
    }));
});
