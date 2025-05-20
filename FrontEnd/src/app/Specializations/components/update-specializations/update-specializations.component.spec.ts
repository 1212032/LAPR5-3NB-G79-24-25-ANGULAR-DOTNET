import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { SpecializationService } from '../../services/specializations.service';
import { UpdateSpecializationsComponent } from './update-specializations.component';
import { SpecializationsDto } from '../../dto/specializationsDto';

describe('UpdateSpecializationsComponent', () => {
  let component: UpdateSpecializationsComponent;
  let fixture: ComponentFixture<UpdateSpecializationsComponent>;
  let mockService: jasmine.SpyObj<SpecializationService>;
  let mockToastr: jasmine.SpyObj<ToastrService>;
  let mockActivatedRoute: any;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('SpecializationService', [
      'getSpecializationById',
      'updateSpecialization',
    ]);
    mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        params: { id: '1' },
      },
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, UpdateSpecializationsComponent],
      providers: [
        { provide: SpecializationService, useValue: mockService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateSpecializationsComponent);
    component = fixture.componentInstance;

    const specializationData: SpecializationsDto = {
      id: 1,
      code: 'ABC',
      name: 'Test',
      description: 'Test description',
    };
    mockService.getSpecializationById.and.returnValue(of(specializationData));

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with specialization data', () => {
    expect(component.updateForm).toBeTruthy();
    expect(component.updateForm.value).toEqual({
      code: 'ABC',
      name: 'Test',
      description: 'Test description',
    });
  });

  it('should show success message when specialization is updated successfully', fakeAsync(() => {
    const mockUpdatedSpecialization: SpecializationsDto = {
      id: 1,
      code: 'ABC',
      name: 'Updated Test',
      description: 'Updated description',
    };

    mockService.updateSpecialization.and.returnValue(of(mockUpdatedSpecialization));

    component.updateForm.patchValue({
      code: 'ABC',
      name: 'Updated Test',
      description: 'Updated description',
    });

    component.updateSpecialization();
    tick();

    expect(mockToastr.success).toHaveBeenCalledWith('Specialization updated successfully!', 'Success');
    expect(mockService.updateSpecialization).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/specialization/search']);
  }));

  it('should show error message when updating fails', fakeAsync(() => {
    const errorResponse = { error: { message: 'Update failed' } };
    mockService.updateSpecialization.and.returnValue(throwError(() => errorResponse));

    component.updateForm.patchValue({
      code: 'ABC',
      name: 'Test',
      description: 'Test description',
    });

    component.updateSpecialization();
    tick();

    expect(mockToastr.error).toHaveBeenCalledWith('Error updating specialization:\nUpdate failed', 'Error');
  }));
});
