import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { UpdateMedicalConditionComponent } from './update-medical-condition.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MedicalConditionDto } from '../../dto/medicalConditionDto';
import { MedicalConditionService } from '../../services/medical-condition.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

describe('UpdateMedicalConditionComponent', () => {
    let component: UpdateMedicalConditionComponent;
    let fixture: ComponentFixture<UpdateMedicalConditionComponent>;
    let mockService: jasmine.SpyObj<MedicalConditionService>;
    let mockToastr: jasmine.SpyObj<ToastrService>;
    let mockActivatedRoute: any;
    let mockRouter: any;

    beforeEach(async () => {
        mockService = jasmine.createSpyObj('MedicalConditionService', ['updateMedicalCondition',]);
        mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error']);
        mockActivatedRoute = {
            params: of({ id: 1 })
        };
        mockRouter = {
            navigate: jasmine.createSpy('navigate')
        };

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, UpdateMedicalConditionComponent],
            providers: [
                { provide: MedicalConditionService, useValue: mockService },
                { provide: ToastrService, useValue: mockToastr },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: Router, useValue: mockRouter },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateMedicalConditionComponent);
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
        component.medicalConditionId = '1';
        component.medicalConditionForm.patchValue({
            code: 'C123',
            name: 'Condition A',
            description: 'Test description',
        });
        component.addSymptom();
        component.symptoms.controls[0].patchValue({ symptom: 'Symptom 1' });

        const dto = component.createDto();

        expect(dto).toEqual({
            id: '1',
            code: 'C123',
            name: 'Condition A',
            description: 'Test description',
            symptoms: ['Symptom 1'],
        });
    });

    it('should show success message when Medical Condition is updated successfully', fakeAsync(() => {
        const mockMedicalCondition: MedicalConditionDto = {
            code: 'C123',
            name: 'Condition A',
            description: 'Test description',
            symptoms: ['Symptom 1'],
            id: '1'
        }

        mockService.updateMedicalCondition.and.returnValue(of(mockMedicalCondition));

        component.medicalConditionForm.patchValue({
            code: 'C123',
            name: 'Condition A',
            description: 'Test description',
        });
        component.addSymptom();
        component.symptoms.controls[0].patchValue({ symptom: 'Symptom 1' });

        component.updateMedicalCondition();

        tick();

        expect(mockToastr.success).toHaveBeenCalledWith(
            'Medical condition updated successfully',
            'Success'
        );
        expect(mockService.updateMedicalCondition).toHaveBeenCalled();
    }));

    it('should show error message when updating fails', () => {
        const errorResponse = new HttpErrorResponse({
            error: { message: 'Updating failed' },
        });
        mockService.updateMedicalCondition.and.returnValue(
            throwError(() => errorResponse)
        );

        component.medicalConditionForm.patchValue({
            code: 'C123',
            name: 'Condition A',
            description: 'Test description',
        });
        component.addSymptom();
        component.symptoms.controls[0].patchValue({ symptom: 'Symptom 1' });

        component.updateMedicalCondition();

        expect(mockToastr.error).toHaveBeenCalledWith(
            'Failed to update medical condition\nUpdating failed',
            'Error'
        );
    });
});
