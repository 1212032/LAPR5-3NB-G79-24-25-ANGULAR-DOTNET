import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { UpdatePatientComponent } from './update-patient.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PatientService } from '../../services/patient.service';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { PatientModel } from '../../model/patientModel';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UpdatePatientComponent', () => {
  let component: UpdatePatientComponent;
  let fixture: ComponentFixture<UpdatePatientComponent>;
  let patientService: jasmine.SpyObj<PatientService>;
  let router: jasmine.SpyObj<Router>;
  let toastr: jasmine.SpyObj<ToastrService>;

  let mockService: any;

  let mockToastrService: any;
  let mockActivatedRoute: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockService = {
      getPatientById: jasmine.createSpy('getPatientById').and.returnValue(of({})),
      updatePatient: jasmine.createSpy('updatePatient').and.returnValue(of({}))
    };
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: (key: string) => '1', // Simulating the patient ID being passed
        },
      },
    };
    mockToastrService = {
      error: jasmine.createSpy('error'),
      success: jasmine.createSpy('success')
    };
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CommonModule, BrowserAnimationsModule],
      providers: [
        { provide: PatientService, useValue: mockService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideHttpClient()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    const formValues = component.patientForm.value;
    expect(formValues.firstName).toBe('');
    expect(formValues.lastName).toBe('');
    expect(formValues.email).toBe('');
    expect(formValues.gender).toBe('');
    expect(formValues.dateOfBirth).toBe('');
  });

  it('should load patient data on initialization', fakeAsync(() => {
    const mockPatient: PatientModel = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      gender: 'Male',
      dateOfBirth: new Date(1900, 1, 1),
      phone: '123456789',
      emergencyContact: 'Jane Doe',
      medicalRecord: 'MR001',
    };

    mockService.getPatientById.and.returnValue(of(mockPatient));
    component.ngOnInit();
    tick();

    expect(mockService.getPatientById).toHaveBeenCalledWith('1');
    expect(component.patientForm.value.firstName).toBe('John');
    expect(component.patientForm.value.lastName).toBe('Doe');
    expect(component.patientForm.value.email).toBe('john.doe@example.com');
    expect(component.patientForm.value.gender).toBe('Male');
    expect(component.patientForm.value.dateOfBirth).toEqual('1900-02-01');
  }));

  it('should display error message if patient data fails to load', fakeAsync(() => {
    mockService.getPatientById.and.returnValue(throwError('Error loading patient data'));
    component.ngOnInit();
    tick();

    expect(mockToastrService.error).toHaveBeenCalledWith('Failed to fetch patient data.\nError loading patient data', 'Error');
  }));

  it('should update patient successfully', fakeAsync(() => {
    const updatedPatient = {
      id: '1',
      firstName: 'John Updated',
      lastName: 'Doe Updated',
      email: 'john.updated@example.com',
      gender: 'Male',
      dateOfBirth: new Date(1900, 1, 1),
      phone: '987654321',
      emergencyContact: 'Jane Updated',
    };

    mockService.updatePatient.and.returnValue(of(updatedPatient));
    component.patientForm.patchValue({
      firstName: 'John Updated',
      lastName: 'Doe Updated',
      email: 'john.updated@example.com',
      gender: 'Male',
      dateOfBirth: new Date(1900, 1, 1),
      phone: '987654321',
      emergencyContact: 'Jane Updated',
    });
    component.patientId = '1';
    component.updatePatient();
    tick();

    expect(mockService.updatePatient).toHaveBeenCalledWith('1', jasmine.objectContaining(updatedPatient));
    expect(mockToastrService.success).toHaveBeenCalledWith('Patient updated successfully!', 'Success');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/patient/search']);
  }));

  it('should show error message if update fails', fakeAsync(() => {
    mockService.updatePatient.and.returnValue(throwError({ error: { message: 'Error updating patient' } }));
    component.patientForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      gender: 'Male',
      dateOfBirth: '1990-01-01',
      phone: '123456789',
      emergencyContact: 'Jane Doe',
    });

    component.updatePatient();
    tick();

    expect(mockService.updatePatient).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalledWith('Error updating patient:\nError updating patient', 'Error');
  }));


});
