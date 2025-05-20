import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CreateOperationTypeComponent } from './create-operation-type.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { OperationTypeService } from '../../services/operationType.service';
import { OperationTypeDto } from '../../dto/operationTypeDto';

describe('CreateOperationTypeComponent', () => {
    let component: CreateOperationTypeComponent;
    let fixture: ComponentFixture<CreateOperationTypeComponent>;
    let toastrService: jasmine.SpyObj<ToastrService>;
    let operationTypeService: jasmine.SpyObj<OperationTypeService>;

    beforeEach(async () => {
        toastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
        operationTypeService = jasmine.createSpyObj('OperationTypeService', ['getAllSpecializations', 'createOperationType']);

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            providers: [
                FormBuilder,
                { provide: ToastrService, useValue: toastrService },
                { provide: OperationTypeService, useValue: operationTypeService }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateOperationTypeComponent);
        component = fixture.componentInstance;

        // Mocking getAllSpecializations response
        operationTypeService.getAllSpecializations.and.returnValue(of([
            { id: 1, name: 'Specialization 1' },
            { id: 2, name: 'Specialization 2' }
        ]));

        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form on ngOnInit', () => {
        expect(component.operationTypeForm).toBeDefined();
        expect(component.operationTypeForm.get('name')).toBeTruthy();
        expect(component.operationTypeForm.get('preparationPhaseDuration')).toBeTruthy();
        expect(component.preparationPhaseSpecializations.controls.length).toBe(1);
    });

    it('should fetch specializations on ngOnInit', () => {
        expect(component.specializations?.length).toBe(2);
        expect(operationTypeService.getAllSpecializations).toHaveBeenCalled();
    });

    it('should add a new specialization form group', () => {
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

    it('should show success message when operation type is created successfully', () => {
        let opType: OperationTypeDto = {
            active: true,
            id: 1,
            name: 'Tipo',
            phases: []
        }
        operationTypeService.createOperationType.and.returnValue(of(opType));

        component.operationTypeForm.patchValue({ name: 'Test Operation' });
        component.createOperationType();

        expect(toastrService.success).toHaveBeenCalledWith('Operation type created successfully', 'Success');
        expect(component.operationTypeForm.value.name).toBeFalsy(); // Form should be reset
    });

    it('should show error message when creation fails', () => {
        operationTypeService.createOperationType.and.returnValue(throwError({ error: { message: 'Failed to create' } }));

        component.operationTypeForm.patchValue({ name: 'Test Operation' });
        component.createOperationType();

        expect(toastrService.error).toHaveBeenCalledWith('Failed to create operation type\nFailed to create', 'Error');
    });
});
