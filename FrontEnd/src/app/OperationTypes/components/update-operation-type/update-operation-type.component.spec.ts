import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UpdateOperationTypeComponent } from './update-operation-type.component';
import { FormBuilder, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { OperationTypeService } from '../../services/operationType.service';
import { OperationTypeDto } from '../../dto/operationTypeDto';

describe('UpdateOperationTypeComponent', () => {
    let component: UpdateOperationTypeComponent;
    let fixture: ComponentFixture<UpdateOperationTypeComponent>;
    let toastrService: jasmine.SpyObj<ToastrService>;
    let operationTypeService: jasmine.SpyObj<OperationTypeService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        toastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
        operationTypeService = jasmine.createSpyObj('OperationTypeService', ['getAllSpecializations', 'getOperationTypeById', 'updateOperationType']);
        router = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            providers: [
                FormBuilder,
                { provide: ToastrService, useValue: toastrService },
                { provide: OperationTypeService, useValue: operationTypeService },
                { provide: Router, useValue: router },
                {
                    provide: ActivatedRoute,
                    useValue: { params: of({ id: 123 }) }
                }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UpdateOperationTypeComponent);
        component = fixture.componentInstance;

        // Mocking getAllSpecializations response
        operationTypeService.getAllSpecializations.and.returnValue(of([
            { id: 1, name: 'Specialization 1' },
            { id: 2, name: 'Specialization 2' }
        ]));

        // Mocking getOperationTypeById response
        operationTypeService.getOperationTypeById.and.returnValue(of({
            id: 123,
            name: 'Test Operation',
            phases: [
                { name: 'Preparation', duration: 30, specializations: { 1: 2 } },
                { name: 'Surgery', duration: 60, specializations: { 2: 1 } },
                { name: 'Cleaning', duration: 15, specializations: { 1: 1 } }
            ],
            active: true
        } as OperationTypeDto));

        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form on ngOnInit', async () => {
        expect(component.operationTypeForm).toBeDefined();
        expect(component.operationTypeForm.get('name')).toBeTruthy();
        expect(component.preparationPhaseSpecializations.controls.length).toBe(0); // From the mock data
        expect(component.surgeryPhaseSpecializations.controls.length).toBe(0); // From the mock data
        expect(component.cleaningPhaseSpecializations.controls.length).toBe(0); // From the mock data
    });

    it('should add a specialization form group', () => {
        const initialCount = component.preparationPhaseSpecializations.length;
        component.addSpecialization('preparationPhaseSpecializations');
        expect(component.preparationPhaseSpecializations.length).toBe(initialCount + 1);
    });

    it('should remove a specialization form group', () => {
        component.addSpecialization('preparationPhaseSpecializations');
        const initialCount = component.preparationPhaseSpecializations.length;

        component.removeSpecialization('preparationPhaseSpecializations', 0);
        expect(component.preparationPhaseSpecializations.length).toBe(initialCount - 1);
    });

    it('should create a valid DTO', () => {
        component.operationTypeForm.patchValue({
            name: 'Updated Operation',
            preparationPhaseDuration: 25,
            surgeryPhaseDuration: 50,
            cleaningPhaseDuration: 20,
        });

        // Manually add specialization data to FormArrays
        component.preparationPhaseSpecializations.clear();
        component.preparationPhaseSpecializations.push(component.createSpecializationFormGroupWithValues(1, 3));

        component.surgeryPhaseSpecializations.clear();
        component.surgeryPhaseSpecializations.push(component.createSpecializationFormGroupWithValues(1, 3));

        component.cleaningPhaseSpecializations.clear();
        component.cleaningPhaseSpecializations.push(component.createSpecializationFormGroupWithValues(1, 3));

        component.operationTypeId = 123;

        const dto = component.createDTO();
        expect(dto).toEqual({
            id: 123,
            name: 'Updated Operation',
            phases: [
                {
                    name: 'Anesthesia/patient preparation',
                    duration: 25,
                    specializations: { 1: 3 }
                },
                {
                    name: 'Surgery',
                    duration: 50,
                    specializations: { 1: 3 }
                },
                {
                    name: 'Cleaning',
                    duration: 20,
                    specializations: { 1: 3 }
                }
            ]
        });
    });


    it('should update the operation type', fakeAsync(() => {
        operationTypeService.updateOperationType.and.returnValue(of());

        component.operationTypeForm.patchValue({
            name: 'Updated Operation',
            preparationPhaseDuration: 25,
            surgeryPhaseDuration: 50,
            cleaningPhaseDuration: 20,
        });

        component.updateOperationType();
        tick();

        expect(operationTypeService.updateOperationType).toHaveBeenCalledWith(component.createDTO());
    }));

    it('should show error message when update fails', () => {
        operationTypeService.updateOperationType.and.returnValue(throwError({ error: { message: 'Update failed' } }));

        component.operationTypeForm.patchValue({ name: 'Updated Operation' });
        component.updateOperationType();

        expect(toastrService.error).toHaveBeenCalledWith('Failed to update operation type\nUpdate failed', 'Error');
    });
});
