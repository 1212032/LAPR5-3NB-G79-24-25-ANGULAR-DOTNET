import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { CreateMedicalConditionComponent } from './create-medical-condition.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MedicalConditionDto } from '../../dto/medicalConditionDto';
import { MedicalConditionService } from '../../services/medical-condition.service';

describe('CreateMedicalConditionComponent', () => {
    let component: CreateMedicalConditionComponent;
    let fixture: ComponentFixture<CreateMedicalConditionComponent>;
    let mockService: jasmine.SpyObj<MedicalConditionService>;
    let mockToastr: jasmine.SpyObj<ToastrService>;

    beforeEach(async () => {
        mockService = jasmine.createSpyObj('MedicalConditionService', [
            'createMedicalCondition',
        ]);
        mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error']);

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, CreateMedicalConditionComponent],
            providers: [
                { provide: MedicalConditionService, useValue: mockService },
                { provide: ToastrService, useValue: mockToastr },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CreateMedicalConditionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should create Medical Condition form group', () => {
        expect(component.medicalConditionForm).toBeTruthy();
        expect(component.medicalConditionForm.contains('code')).toBeTrue();
        expect(component.medicalConditionForm.contains('name')).toBeTrue();
        expect(component.medicalConditionForm.contains('description')).toBeTrue();
        expect(component.medicalConditionForm.contains('symptoms')).toBeTrue();
    });

    it('should create Medical Condition dto', () => {
        component.medicalConditionForm.patchValue({
            code: 'C123',
            name: 'Condition A',
            description: 'Test description',
        });
        component.addSymptom();
        component.symptoms.controls[0].patchValue({ symptom: 'Symptom 1' });

        const dto = component.createDto();

        expect(dto).toEqual({
            code: 'C123',
            name: 'Condition A',
            description: 'Test description',
            symptoms: ['Symptom 1'],
        });
    });

    it('should show success message when Medical Condition is created successfully', fakeAsync(() => {
        const mockMedicalCondition: MedicalConditionDto = {
            code: 'C123',
            name: 'Condition A',
            description: 'Test description',
            symptoms: ['Symptom 1'],
            id: '1'
        }

        mockService.createMedicalCondition.and.returnValue(of(mockMedicalCondition));

        component.medicalConditionForm.patchValue({
            code: 'C123',
            name: 'Condition A',
            description: 'Test description',
        });
        component.addSymptom();
        component.symptoms.controls[0].patchValue({ symptom: 'Symptom 1' });

        component.createMedicalCondition();

        tick();

        expect(mockToastr.success).toHaveBeenCalledWith(
            'Medical condition created successfully',
            'Success'
        );
        expect(mockService.createMedicalCondition).toHaveBeenCalled();
    }));

    it('should show error message when creation fails', () => {
        const errorResponse = new HttpErrorResponse({
            error: { message: 'Creation failed' },
        });
        mockService.createMedicalCondition.and.returnValue(
            throwError(() => errorResponse)
        );

        component.medicalConditionForm.patchValue({
            code: 'C123',
            name: 'Condition A',
            description: 'Test description',
        });
        component.addSymptom();
        component.symptoms.controls[0].patchValue({ symptom: 'Symptom 1' });

        component.createMedicalCondition();

        expect(mockToastr.error).toHaveBeenCalledWith(
            'Failed to create medical condition\nCreation failed',
            'Error'
        );
    });
});
