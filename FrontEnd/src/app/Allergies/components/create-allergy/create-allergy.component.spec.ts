import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { CreateAllergyComponent } from './create-allergy.component';
import { HttpErrorResponse } from '@angular/common/http';
import { AllergyDto } from '../../dto/allergyDto';
import { AllergyService } from '../../services/allergy.service';

describe('CreateAllergyComponent', () => {
    let component: CreateAllergyComponent;
    let fixture: ComponentFixture<CreateAllergyComponent>;
    let mockService: jasmine.SpyObj<AllergyService>;
    let mockToastr: jasmine.SpyObj<ToastrService>;

    beforeEach(async () => {
        mockService = jasmine.createSpyObj('AllergyService', [
            'createAllergy',
        ]);
        mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error']);

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, CreateAllergyComponent],
            providers: [
                { provide: AllergyService, useValue: mockService },
                { provide: ToastrService, useValue: mockToastr },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CreateAllergyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should create Allergy form group', () => {
        expect(component.patientForm).toBeTruthy();
        expect(component.patientForm.contains('code')).toBeTrue();
        expect(component.patientForm.contains('name')).toBeTrue();
        expect(component.patientForm.contains('description')).toBeTrue();
    });

    it('should create Allergy dto', () => {
        component.patientForm.patchValue({
            code: 'A123',
            name: 'Allergy A',
            description: 'Test description',
        });

        const dto = component.createDto();

        expect(dto).toEqual({
            code: 'A123',
            name: 'Allergy A',
            description: 'Test description'
        });
    });

    it('should show success message when Allergy is created successfully', fakeAsync(() => {
        const mockAllergy: AllergyDto = {
            code: 'A123',
            name: 'Allergy A',
            description: 'Test description',
            id: '1'
        }

        mockService.createAllergy.and.returnValue(of(mockAllergy));

        component.patientForm.patchValue({
            code: 'A123',
            name: 'Allergy A',
            description: 'Test description',
        });

        component.createAllergy();

        tick();

        expect(mockToastr.success).toHaveBeenCalledWith(
            'Allergy created successfully',
            'Success'
        );
        expect(mockService.createAllergy).toHaveBeenCalled();
    }));

    it('should show error message when creation fails', () => {
        const errorResponse = new HttpErrorResponse({
            error: { message: 'Creation failed' },
        });
        mockService.createAllergy.and.returnValue(
            throwError(() => errorResponse)
        );

        component.patientForm.patchValue({
            code: 'A123',
            name: 'Allergy A',
            description: 'Test description',
        });

        component.createAllergy();

        expect(mockToastr.error).toHaveBeenCalledWith(
            'Failed to create allergy\nCreation failed',
            'Error'
        );
    });
});
