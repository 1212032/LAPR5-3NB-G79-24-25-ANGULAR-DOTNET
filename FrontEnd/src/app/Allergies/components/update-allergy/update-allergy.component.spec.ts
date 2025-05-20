import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { UpdateAllergyComponent } from './update-allergy.component';
import { HttpErrorResponse } from '@angular/common/http';
import { AllergyDto } from '../../dto/allergyDto';
import { AllergyService } from '../../services/allergy.service';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

describe('UpdateAllergyComponent', () => {
    let component: UpdateAllergyComponent;
    let fixture: ComponentFixture<UpdateAllergyComponent>;
    let mockService: jasmine.SpyObj<AllergyService>;
    let mockToastr: jasmine.SpyObj<ToastrService>;
    let mockActivatedRoute: any;
    let mockRouter: any;

    beforeEach(async () => {
        mockService = jasmine.createSpyObj('AllergyService', [
            'updateAllergy',
        ]);
        mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error']);

        mockActivatedRoute = {
            params: of({ id: 1 })
        };
        mockRouter = {
            navigate: jasmine.createSpy('navigate')
        };

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, UpdateAllergyComponent],
            providers: [
                { provide: AllergyService, useValue: mockService },
                { provide: ToastrService, useValue: mockToastr },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: Router, useValue: mockRouter },
                provideHttpClient(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateAllergyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should create Allergy form group', () => {
        expect(component.allergyForm).toBeTruthy();
        expect(component.allergyForm.contains('code')).toBeTrue();
        expect(component.allergyForm.contains('name')).toBeTrue();
        expect(component.allergyForm.contains('description')).toBeTrue();
    });

    it('should create Allergy dto', () => {
        component.allergyId = '123-456';
        component.allergyForm.patchValue({
            code: 'A123',
            name: 'Allergy A',
            description: 'Test description',
        });

        const dto = component.createDto();

        expect(dto).toEqual({
            id: '123-456',
            code: 'A123',
            name: 'Allergy A',
            description: 'Test description'
        });
    });

    it('should show success message when Allergy is updated successfully', fakeAsync(() => {
        const mockAllergy: AllergyDto = {
            code: 'A123',
            name: 'Allergy A',
            description: 'Test description',
            id: '1'
        }

        mockService.updateAllergy.and.returnValue(of(mockAllergy));

        component.allergyForm.patchValue({
            code: 'A123',
            name: 'Allergy A',
            description: 'Test description',
        });

        component.updateAllergy();

        tick();

        expect(mockToastr.success).toHaveBeenCalledWith(
            'Allergy updated successfully',
            'Success'
        );
        expect(mockService.updateAllergy).toHaveBeenCalled();
    }));

    it('should show error message when updating fails', () => {
        const errorResponse = new HttpErrorResponse({
            error: { message: 'Updating failed' },
        });
        mockService.updateAllergy.and.returnValue(
            throwError(() => errorResponse)
        );

        component.allergyForm.patchValue({
            code: 'A123',
            name: 'Allergy A',
            description: 'Test description',
        });

        component.updateAllergy();

        expect(mockToastr.error).toHaveBeenCalledWith(
            'Failed to update allergy\nUpdating failed',
            'Error'
        );
    });
});
