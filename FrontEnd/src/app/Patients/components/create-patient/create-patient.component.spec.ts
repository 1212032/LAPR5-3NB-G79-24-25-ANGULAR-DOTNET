import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { CreatePatientComponent } from './create-patient.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PatientModel } from '../../model/patientModel';

describe('CreatePatientComponent', () => {
  let component: CreatePatientComponent;
  let fixture: ComponentFixture<CreatePatientComponent>;
  let patientService: jasmine.SpyObj<PatientService>;
  let router: jasmine.SpyObj<Router>;
  let toastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    patientService = jasmine.createSpyObj('PatientService', ['createPatient']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    toastr = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CommonModule],
      providers: [
        FormBuilder,
        { provide: PatientService, useValue: patientService },
        { provide: Router, useValue: router },
        { provide: ToastrService, useValue: toastr },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.patientForm).toBeDefined();
    const formValues = component.patientForm.value;
    expect(formValues.firstName).toBe('');
    expect(formValues.lastName).toBe('');
    expect(formValues.gender).toBe('');
    expect(formValues.dateOfBirth).toBe('');
    expect(formValues.address).toBe('');
    expect(formValues.phone).toBe('');
    expect(formValues.email).toBe('');
    expect(formValues.emergencyContact).toBe('');
  });

  it('should mark all fields as touched if form is invalid on submit', () => {
    spyOn(component.patientForm, 'markAllAsTouched');
    component.onSubmit();
    expect(component.patientForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('should call PatientService.createPatient when form is valid', fakeAsync(() => {
    const mockPatient: PatientModel = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      gender: 'Man',
      dateOfBirth: new Date(2000, 1, 1),
      phone: '1234567890',
      email: 'john.doe@example.com',
      emergencyContact: 'Jane Doe',
      medicalRecord: 'MR123'
    };
    patientService.createPatient.and.returnValue(of(mockPatient));

    component.patientForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      gender: 'Man',
      dateOfBirth: new Date(2000, 1, 1),
      phone: '1234567890',
      email: 'john.doe@example.com',
      emergencyContact: 'Jane Doe',
      address: 'Rua da avenida'
    })

    component.onSubmit();
    tick();

    expect(patientService.createPatient).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('Patient created successfully', 'Success');
    expect(router.navigate).toHaveBeenCalledWith(['/admin/patient/search']);
  }));

  it('should show error message if patient creation fails', fakeAsync(() => {
    patientService.createPatient.and.returnValue(throwError({ error: { message: 'Error creating patient' } }));

    component.patientForm.setValue({
      firstName: 'Joao',
      lastName: 'Dias',
      gender: 'Man',
      dateOfBirth: new Date(2000, 1, 1),
      phone: '1234567890',
      email: 'email@email.com',
      emergencyContact: '912350134',
      address: 'Rua da avenida'
    });

    component.onSubmit();
    tick();

    expect(patientService.createPatient).toHaveBeenCalled();
    expect(toastr.error).toHaveBeenCalledWith('Error creating patient:\nError creating patient', 'Error');
  }));
});
