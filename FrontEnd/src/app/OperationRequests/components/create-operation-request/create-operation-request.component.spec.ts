import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateOperationRequestComponent } from './create-operation-request.component';
import { OperationRequestService } from '../../services/operationRequest.service';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';


describe('CreateOperationRequestComponent', () => {
  let component: CreateOperationRequestComponent;
  let fixture: ComponentFixture<CreateOperationRequestComponent>;
  let mockService: any;
  let mockToastr: any;

  beforeEach(async () => {
    mockService = {
      getAllPatients: jasmine.createSpy('getAllPatients').and.returnValue(of([])),
      getAllOperationTypes: jasmine.createSpy('getAllOperationTypes').and.returnValue(of([])),
      createOperationRequest: jasmine.createSpy('createOperationRequest').and.returnValue(of({})),
    };
    //mockService = jasmine.createSpyObj('OperationRequestService', ['getAllOperationTypes', 'getAllPatients', 'createOperationRequest']);
    //mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    mockToastr = {
      error: jasmine.createSpy('error'),
      success: jasmine.createSpy('success')
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CommonModule, CreateOperationRequestComponent],
      providers: [
        { provide: OperationRequestService, useValue: mockService },
        { provide: ToastrService, useValue: mockToastr },
        provideHttpClient(),
      ]
    }).compileComponents();

    //mockService = TestBed.inject(OperationRequestService);
    fixture = TestBed.createComponent(CreateOperationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllPatients on init', async () => {
    spyOn(component, 'ngOnInit').and.callThrough();

    await component.ngOnInit();
    expect(mockService.getAllPatients).toHaveBeenCalled();
  });

  it('should call getAllOperationTypes on init', async () => {
    spyOn(component, 'ngOnInit').and.callThrough();

    await component.ngOnInit();
    expect(mockService.getAllOperationTypes).toHaveBeenCalled();
  });
  it('should update form with values', () => {
    component.operationRequestForm.setValue({
      deadlineDate: '2023-10-10',
      priority: 'High',
      operationType: '1',
      patientMedicalRecordNumber: '12345'
    });
    expect(component.operationRequestForm.controls['deadlineDate'].value).toBe('2023-10-10');
    expect(component.operationRequestForm.controls['priority'].value).toBe('High');
    expect(component.operationRequestForm.controls['operationType'].value).toBe('1');
    expect(component.operationRequestForm.controls['patientMedicalRecordNumber'].value).toBe('12345');
  });

  it('should create operation request dto', () => {
    component.operationRequestForm.setValue({
      deadlineDate: '2023-10-10',
      priority: 'High',
      operationType: 'Type1',
      patientMedicalRecordNumber: '12345'
    });

    const dto = component.createDto();

    expect(dto).toEqual({
      deadlineDate: '2023-10-10',
      priority: 'High',
      operationType: 'Type1',
      patientMedicalRecordNumber: '12345'
    });
  });

  it('should call createOperationRequest on form submit', () => {
    spyOn(component, 'createOperationRequest').and.callThrough();

    component.operationRequestForm.setValue({
      deadlineDate: '2025-10-10',
      priority: 'High',
      operationType: 'Type1',
      patientMedicalRecordNumber: '12345'
    });

    component.createOperationRequest();

    expect(component.createOperationRequest).toHaveBeenCalled();
    expect(mockService.createOperationRequest).toHaveBeenCalled();
  });

  it('should show success toastr on successful operation request creation', () => {
    component.operationRequestForm.setValue({
      deadlineDate: '2025-10-10',
      priority: 'High',
      operationType: 'Type1',
      patientMedicalRecordNumber: '12345'
    });

    component.createOperationRequest();

    expect(mockToastr.success).toHaveBeenCalledWith('Operation request created successfully', 'Success');
  });


});



