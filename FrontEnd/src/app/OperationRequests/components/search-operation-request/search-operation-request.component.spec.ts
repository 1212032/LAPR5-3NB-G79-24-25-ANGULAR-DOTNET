import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { OperationRequestModel } from '../../model/operation-request.model';
import { SearchOperationRequestComponent } from './search-operation-request.component';
import { OperationRequestService } from '../../services/operationRequest.service';
import { ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterOutlet } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { OperationRequestDto } from '../../dto/operationRequestDto';


describe('SearchOperationRequestComponent', () => {
  let component: SearchOperationRequestComponent;
  let fixture: ComponentFixture<SearchOperationRequestComponent>;

  let mockService: jasmine.SpyObj<OperationRequestService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  beforeEach(async () => {

    mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    mockService = jasmine.createSpyObj('OperationRequestService', ['searchOperationRequestWithFilters', 'removeOperationRequest']);

    TestBed.configureTestingModule({
      imports: [SearchOperationRequestComponent, ReactiveFormsModule, CommonModule, MatSortModule, RouterOutlet, BrowserAnimationsModule],
      providers: [
        { provide: ToastrService, useValue: mockToastrService },
        { provide: OperationRequestService, useValue: mockService },
        provideHttpClient(),
      ]
    });

    mockService = TestBed.inject(OperationRequestService) as jasmine.SpyObj<OperationRequestService>;
    mockToastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

    fixture = TestBed.createComponent(SearchOperationRequestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sort data correctly', () => {
    component.operationRequestModelList = [
      {
        id: 1,
        deadLineDate: new Date(2023, 1, 1),
        priority: 'High',
        operationType: { id: 1, active: true, name: 'Type1', phases: [] },
        patient: { id: '1', firstName: 'John', lastName: 'Doe', fullName: 'John Doe', medicalRecord: '123', emergencyContact: '987', gender: 'Male', dateOfBirth: '1990-01-01', email: 'john@example.com', phone: '12345', address: 'Address 1' },
        status: ''
      },
      {
        id: 2,
        deadLineDate: new Date(2023, 1, 1),
        priority: 'Low',
        operationType: { id: 2, active: true, name: 'Type2', phases: [] },
        patient: { id: '2', firstName: 'Jane', lastName: 'Doe', fullName: 'Jane Doe', medicalRecord: '456', emergencyContact: '654', gender: 'Female', dateOfBirth: '1992-02-02', email: 'jane@example.com', phone: '67890', address: 'Address 2' },
        status: ''
      }
    ];

    component.sortData({ active: 'priority', direction: 'asc' });
    expect(component.operationRequestModelList[0].priority).toBe('High');

    component.sortData({ active: 'priority', direction: 'desc' });
    expect(component.operationRequestModelList[0].priority).toBe('Low');
  });
  describe('Remove Operation Request', () => {
    it('should remove operation request', () => {
      let opRequestDto: OperationRequestDto = {
        id: 1,
        deadlineDate: '2023-01-01T00:00:00',
        priority: 'High',
        operationType: 1,
        patientMedicalRecordNumber: '1',
        status: ''
      };
      let operationRequest: OperationRequestModel = {
        id: 1,
        deadLineDate: new Date('2023-01-01'),
        priority: 'High',
        operationType: { id: 1, active: true, name: 'Type1', phases: [] },
        patient: { id: '1', firstName: 'John', lastName: 'Doe', fullName: 'John Doe', medicalRecord: '123', emergencyContact: '987', gender: 'Male', dateOfBirth: '1990-01-01', email: 'john@example.com', phone: '12345', address: 'Address 1' },
        status: ''
      }
      component.operationRequestModelList = [operationRequest];
      component.selectedOperationRequest = component.operationRequestModelList[0];
      component.selectedIndex = 0;

      mockService.removeOperationRequest.and.returnValue(of(opRequestDto));
      component.removeOperationRequest();

      expect(mockService.removeOperationRequest).toHaveBeenCalled();
      expect(component.operationRequestModelList.length).toBe(0);
      expect(mockToastrService.success).toHaveBeenCalledWith('Operation request removed successfully', 'Success');
    });
  });
  describe('Search Operation Requests with filters', () => {
    it('should search with filters', () => {
      component.filtersForm.setValue({
        patientNameFilter: '',
        patientMedicalRecordNumberFilter: '123',
        operationTypeFilter: '',
        priorityFilter: '',
        startDateFilter: '',
        endDateFilter: ''
      });
      let opRequestDto: OperationRequestDto = {
        id: 1,
        deadlineDate: '01/02/2023',
        priority: 'High',
        operationType: 1,
        patientMedicalRecordNumber: '1',
        status: ''
      };

      let patientExpected = { id: '1', firstName: 'John', lastName: 'Doe', fullName: 'John Doe', medicalRecord: '123', emergencyContact: '987', gender: 'Male', dateOfBirth: '1990-01-01', email: 'john@example.com', phone: '12345', address: 'Address 1' }
      let operationTypeExpected = { id: 1, active: true, name: 'Type1', phases: [] };

      let opRequestExpected: OperationRequestModel = {
        id: 1,
        deadLineDate: new Date(2023, 1, 1),
        priority: 'High',
        operationType: operationTypeExpected,
        patient: patientExpected,
        status: ''
      };

      component.operationRequestModelList = [opRequestExpected];
      component.operationTypes = [operationTypeExpected];
      component.patients = [patientExpected];

      mockService.searchOperationRequestWithFilters.and.returnValue(of([opRequestDto]));
      component.searchWithFilters();

      expect(mockService.searchOperationRequestWithFilters).toHaveBeenCalled();
      expect(component.operationRequestModelList[0].deadLineDate).toEqual(new Date(2023, 1, 1));
    });

    it('should handle empty search results', () => {
      component.filtersForm.setValue({
        patientNameFilter: '',
        patientMedicalRecordNumberFilter: '123',
        operationTypeFilter: '',
        priorityFilter: '',
        startDateFilter: '',
        endDateFilter: ''
      });
      component.operationRequestModelList = [];

      mockService.searchOperationRequestWithFilters.and.returnValue(of([]));
      component.searchWithFilters();

      expect(mockService.searchOperationRequestWithFilters).toHaveBeenCalled();
      expect(component.operationRequestModelList.length).toBe(0);
    });
  });

});