import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { SearchOperationTypeComponent } from './search-operation-type.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OperationTypeService } from '../../services/operationType.service';
import { Router, RouterOutlet } from '@angular/router';
import { of, throwError } from 'rxjs';
import { OperationTypeDto } from '../../dto/operationTypeDto';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { provideHttpClient } from '@angular/common/http';

describe('SearchOperationTypeComponent', () => {
    let component: SearchOperationTypeComponent;
    let fixture: ComponentFixture<SearchOperationTypeComponent>;
    let toastrService: jasmine.SpyObj<ToastrService>;
    let operationTypeService: jasmine.SpyObj<OperationTypeService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        toastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
        operationTypeService = jasmine.createSpyObj('OperationTypeService', [
            'getAllSpecializations',
            'getOperationTypes',
            'inactivateOperationType'
        ]);
        router = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, BrowserAnimationsModule, CommonModule, MatSortModule, RouterOutlet],
            providers: [
                FormBuilder,
                { provide: ToastrService, useValue: toastrService },
                { provide: OperationTypeService, useValue: operationTypeService },
                { provide: Router, useValue: router },
                provideHttpClient()
            ]
        }).compileComponents();

        toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchOperationTypeComponent);
        component = fixture.componentInstance;

        // Mocking getAllSpecializations response
        operationTypeService.getAllSpecializations.and.returnValue(of([
            { id: 1, name: 'Specialization 1' },
            { id: 2, name: 'Specialization 2' }
        ]));
        operationTypeService.getOperationTypes.withArgs('', 0, true).and.returnValue(of([
            { id: 1, name: 'Operation type 1', active: true, phases: [{ name: '', duration: 0, specializations: { 1: 1 } }, { name: '', duration: 0, specializations: { 1: 1 } }, { name: '', duration: 0, specializations: { 1: 1 } }] },
            { id: 2, name: 'Operation type 2', active: true, phases: [{ name: '', duration: 0, specializations: { 1: 1 } }, { name: '', duration: 0, specializations: { 1: 1 } }, { name: '', duration: 0, specializations: { 1: 1 } }] },
        ]));

        /*mockService.inactivateStaff.and.returnValue(of(staffDto));
        mockService.getStaff.withArgs(component.filtersForm.value.licenseNumber, component.filtersForm.value.name, component.filtersForm.value.role, component.filtersForm.value.specialization, component.filtersForm.value.active).and.returnValue(of(Array.of(staffDto)));
        
        component.inactivateStaff();
    
        expect(mockService.inactivateStaff).toHaveBeenCalledWith(component.selectedStaffId);
        expect(mockToastrService.success).toHaveBeenCalledWith('Staff inactivated successfully', 'Success');*/

        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch and populate specializations on ngOnInit', () => {
        component.ngOnInit();

        expect(operationTypeService.getAllSpecializations).toHaveBeenCalled();
        expect(component.specializations?.length).toBe(2);
        expect(operationTypeService.getOperationTypes).toHaveBeenCalled();
        expect(component.operationTypeList?.length).toBe(2);
    });


    it('should sort operation types by name', () => {
        component.operationTypeList = [
            { id: 1, name: 'Operation B', phases: [], active: true },
            { id: 2, name: 'Operation A', phases: [], active: false }
        ];

        component.sortData({ active: 'name', direction: 'asc' });

        expect(component.operationTypeList[0].name).toBe('Operation A');
    });

    it('should inactivate operation type successfully', fakeAsync(() => {
        operationTypeService.inactivateOperationType.and.returnValue(of());

        component.selectedOperationTypeId = 1;

        component.inactivateOperationType();
        tick();

        expect(operationTypeService.inactivateOperationType).toHaveBeenCalledWith(1);
    }));

    it('should show error message when inactivation fails', () => {
        operationTypeService.inactivateOperationType.and.returnValue(throwError({ error: { message: 'Error occurred' } }));

        component.selectedOperationTypeId = 1;
        component.inactivateOperationType();

        expect(toastrService.error).toHaveBeenCalledWith('Error occurred', 'Error');
    });

    it('should navigate to update page when updating an operation type', () => {
        const mockOperationType: OperationTypeDto = {
            id: 1,
            name: 'Operation A',
            phases: [],
            active: true
        };

        component.updateOperationType(mockOperationType);

        expect(router.navigate).toHaveBeenCalledWith(['/admin/operationtype/update', 1]);
    });

    it('should set selected operation type correctly', () => {
        const mockOperationType: OperationTypeDto = {
            id: 1,
            name: 'Operation A',
            phases: [],
            active: true
        };

        component.selectedOperationType(mockOperationType);

        expect(component.selectedOperationTypeId).toBe(1);
        expect(component.selectedOperationTypeName).toBe('Operation A');
    });

    it('should handle empty operation type list on sort', () => {
        component.operationTypeList = undefined;

        component.sortData({ active: 'name', direction: 'asc' });

        expect(component.operationTypeList).toBeUndefined();
    });
});
