import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { SearchPatientComponent } from './search-patient.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatSortModule } from '@angular/material/sort';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PatientModel } from '../../model/patientModel';

describe('SearchPatientComponent', () => {
  let component: SearchPatientComponent;
  let fixture: ComponentFixture<SearchPatientComponent>;
  let patientService: jasmine.SpyObj<PatientService>;
  let router: jasmine.SpyObj<Router>;
  let toastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    patientService = jasmine.createSpyObj('PatientService', ['searchPatients', 'deletePatient']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    toastr = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CommonModule, MatSortModule],
      providers: [
        FormBuilder,
        { provide: PatientService, useValue: patientService },
        { provide: Router, useValue: router },
        { provide: ToastrService, useValue: toastr },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    const formValues = component.searchForm.value;
    expect(formValues.name).toBe('');
    expect(formValues.email).toBe('');
    expect(formValues.dateOfBirth).toBe('');
    expect(formValues.medicalRecordNumber).toBe('');
  });

  it('should fetch and populate patients on search', fakeAsync(() => {
    const mockPatients: PatientModel[] = [{
      id: '1',
      firstName: 'Joao',
      lastName: 'Dias',
      gender: 'Man',
      dateOfBirth: new Date(2000, 1, 1),
      phone: '1234567890',
      email: 'email@email.com',
      emergencyContact: '912350134',
      medicalRecord: '123'
    },
    {
      id: '2',
      firstName: 'Dias',
      lastName: 'Brother',
      gender: 'Man',
      dateOfBirth: new Date(2002, 1, 1),
      phone: '1234567890',
      email: 'email@email.com',
      emergencyContact: '912350134',
      medicalRecord: '123'
    }
    ];

    patientService.searchPatients.and.returnValue(of(mockPatients));

    component.searchForm.patchValue({ name: 'John' });
    component.searchPatients();
    tick();

    expect(patientService.searchPatients).toHaveBeenCalledWith({
      name: 'John',
      email: '',
      dateOfBirth: '',
      medicalRecordNumber: '',
      pageNumber: 1,
      pageSize: 10,
    });
    expect(component.patients).toEqual(mockPatients);
    expect(component.sortedPatients).toEqual(mockPatients);
  }));

  it('should display error if search fails', fakeAsync(() => {
    patientService.searchPatients.and.returnValue(throwError('Error fetching patients'));

    component.searchForm.patchValue({ name: 'John' });
    component.searchPatients();
    tick();

    expect(toastr.error).toHaveBeenCalledWith('Error fetching search results:\nError fetching patients', 'Error');
  }));

  it('should navigate to update page when editPatient is called', () => {
    const mockPatient: PatientModel = {
      firstName: 'Joao',
      lastName: 'Dias',
      gender: 'Man',
      dateOfBirth: new Date(2000, 1, 1),
      phone: '1234567890',
      email: 'email@email.com',
      emergencyContact: '912350134',
      id: '1',
      medicalRecord: '123'
    };
    component.editPatient(mockPatient);

    expect(router.navigate).toHaveBeenCalledWith(['/admin/patient/update', mockPatient.id]);
  });

  it('should delete patient and refresh list on success', fakeAsync(() => {
    patientService.deletePatient.and.returnValue(of());

    const mockPatient: PatientModel = {
      firstName: 'Joao',
      lastName: 'Dias',
      gender: 'Man',
      dateOfBirth: new Date(2000, 1, 1),
      phone: '1234567890',
      email: 'email@email.com',
      emergencyContact: '912350134',
      id: '1',
      medicalRecord: '123'
    };

    spyOn(window, 'confirm').and.returnValue(true);

    component.deletePatient(mockPatient);
    tick();

    expect(patientService.deletePatient).toHaveBeenCalledWith(mockPatient.id);
    
  }));

  it('should not delete patient if confirmation is cancelled', () => {

    const mockPatient: PatientModel = {
      firstName: 'Joao',
      lastName: 'Dias',
      gender: 'Man',
      dateOfBirth: new Date(2000, 1, 1),
      phone: '1234567890',
      email: 'email@email.com',
      emergencyContact: '912350134',
      id: '1',
      medicalRecord: '123'
    };
    spyOn(window, 'confirm').and.returnValue(false);

    component.deletePatient(mockPatient);

    expect(patientService.deletePatient).not.toHaveBeenCalled();
  });

  
});
