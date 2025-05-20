import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateOperationRequestComponent } from './update-operation-request.component';
import { OperationRequestService } from '../../services/operationRequest.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

describe('UpdateOperationRequestComponent', () => {
  let component: UpdateOperationRequestComponent;
  let fixture: ComponentFixture<UpdateOperationRequestComponent>;
  let mockOperationRequestService: any;
  let mockToastrService: any;
  let mockActivatedRoute: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockOperationRequestService = {
      getAllPatients: jasmine.createSpy('getAllPatients').and.returnValue(of([])),
      getAllOperationTypes: jasmine.createSpy('getAllOperationTypes').and.returnValue(of([])),
      getOperationRequestById: jasmine.createSpy('getOperationRequestById').and.returnValue(of({})),
      updateOperationRequest: jasmine.createSpy('updateOperationRequest').and.returnValue(of({}))
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
      imports: [UpdateOperationRequestComponent, ReactiveFormsModule],
      providers: [
        { provide: OperationRequestService, useValue: mockOperationRequestService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        provideHttpClient(),
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UpdateOperationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllPatients on init', async () => {
    spyOn(component, 'ngOnInit').and.callThrough();

    await component.ngOnInit();
    expect(mockOperationRequestService.getAllPatients).toHaveBeenCalled();
  });

  it('should call getAllOperationTypes on init', async () => {
    spyOn(component, 'ngOnInit').and.callThrough();

    await component.ngOnInit();
    expect(mockOperationRequestService.getAllOperationTypes).toHaveBeenCalled();
  });

  it('should call getOperationRequestById on init', async () => {
    await component.ngOnInit();
    expect(mockOperationRequestService.getOperationRequestById).toHaveBeenCalledWith(1);
  });

  it('should handle error when getAllPatients fails', async () => {
    mockOperationRequestService.getAllPatients.and.returnValue(throwError({ error: { message: 'Error' } }));
    await component.getAllPatients();
    expect(mockToastrService.error).toHaveBeenCalledWith('Error', 'Error');
  });

  it('should handle error when getAllOperationTypes fails', async () => {
    mockOperationRequestService.getAllOperationTypes.and.returnValue(throwError({ error: { message: 'Error' } }));
    await component.getAllOperationTypes();
    expect(mockToastrService.error).toHaveBeenCalledWith('Operation request invalid, unexpected error! Error', 'Error');
  });

  it('should update form on getOperationRequestById success', async () => {
    const operationRequestDto = {
      id: 1,
      deadlineDate: '01/01/2023',
      priority: 'High',
      operationType: 0,
      patientMedicalRecordNumber: ''
    };
    mockOperationRequestService.getOperationRequestById.and.returnValue(of(operationRequestDto));
    await component.getOperationRequestById();
    expect(component.operationRequestForm.value).toEqual({
      deadlineDate: '2023-01-01',
      priority: 'High',
      operationType: 0,
      patientMedicalRecordNumber: ''
    });
  });

  it('should call updateOperationRequest on updateOnSubmit', () => {
    component.operationRequestForm.setValue({
      deadlineDate: '2023-01-01',
      priority: 'High',
      operationType: 1,
      patientMedicalRecordNumber: '123'
    });
    component.updateOnSubmit();
    expect(mockOperationRequestService.updateOperationRequest).toHaveBeenCalled();
  });

  it('should handle error when updateOperationRequest fails', () => {
    mockOperationRequestService.updateOperationRequest.and.returnValue(throwError({ error: { message: 'Error' } }));
    component.updateOnSubmit();
    expect(mockToastrService.error).toHaveBeenCalledWith('Error', 'Error');
  });

  it('should navigate to search on update success', () => {

    component.updateOnSubmit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/doctor/operationrequest/search']);
  });

  it('should initialize operationRequestForm with default values', () => {
    expect(component.operationRequestForm.value).toEqual({
      deadlineDate: '',
      priority: '',
      operationType: '',
      patientMedicalRecordNumber: ''
    });
  });

  it('should update operationRequestForm when updateOperationRequestForm is called', () => {
    component.operationRequest = {
      id: 1,
      deadLineDate: new Date('2023-01-01'),
      priority: 'High',
      operationType: { id: 1, active: true, name: 'Type1', phases: [] },
      patient: { id: '123', firstName: 'John', lastName: 'Doe', fullName: 'John Doe', medicalRecord: 'MR123', emergencyContact: 'Jane Doe', gender: 'Male', dateOfBirth: '1990-01-01', email: 'john.doe@example.com', phone: '1234567890', address: '123 Main St' },
      status: ''
    };
    component.updateOperationRequestForm();
    expect(component.operationRequestForm.value).toEqual({
      deadlineDate: '2023-01-01',
      priority: 'High',
      operationType: 1,
      patientMedicalRecordNumber: '123'
    });
  });

  it('should create operationRequestDto correctly', () => {
    component.operationRequestForm.setValue({
      deadlineDate: '2023-01-01',
      priority: 'High',
      operationType: 1,
      patientMedicalRecordNumber: '123'
    });
    const dto = component.createOperationRequestDto();
    expect(dto).toEqual({
      id: 1,
      deadlineDate: '2023-01-01',
      priority: 'High',
      operationType: 1,
      patientMedicalRecordNumber: '123'
    });
  });
});
