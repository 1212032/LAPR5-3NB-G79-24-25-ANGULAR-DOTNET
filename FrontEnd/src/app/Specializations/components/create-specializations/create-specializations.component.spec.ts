import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CreateSpecializationsComponent } from './create-specializations.component';
import { SpecializationService } from '../../services/specializations.service';
import { CreatingSpecializationsDto } from '../../dto/creatingSpecializationsDto';

describe('CreateSpecializationsComponent', () => {
  let component: CreateSpecializationsComponent;
  let fixture: ComponentFixture<CreateSpecializationsComponent>;
  let mockService: jasmine.SpyObj<SpecializationService>;
  let mockToastr: jasmine.SpyObj<ToastrService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('SpecializationService', ['createSpecialization']);
    mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error', 'warning']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CreateSpecializationsComponent],
      providers: [
        { provide: SpecializationService, useValue: mockService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSpecializationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create specialization form group', () => {
    expect(component.createForm).toBeTruthy();
    expect(component.createForm.contains('code')).toBeTrue();
    expect(component.createForm.contains('name')).toBeTrue();
    expect(component.createForm.contains('description')).toBeTrue();
  });

  it('should create a specialization dto', () => {
    component.createForm.patchValue({
      code: 'GEN',
      name: 'General Medicine',
      description: 'General medicine specialization',
    });

    const dto = component.createForm.value;

    expect(dto).toEqual({
      code: 'GEN',
      name: 'General Medicine',
      description: 'General medicine specialization',
    });
  });

  it('should show success message when specialization is created successfully', fakeAsync(() => {
    const mockResponse = {
      id: 1,
      code: 'GEN',
      name: 'General Medicine',
      description: 'General medicine specialization',
    };

    mockService.createSpecialization.and.returnValue(of(mockResponse));

    component.createForm.patchValue({
      code: 'GEN',
      name: 'General Medicine',
      description: 'General medicine specialization',
    });

    component.createSpecialization();
    tick();

    expect(mockToastr.success).toHaveBeenCalledWith('Specialization created successfully!', 'Success');
    expect(mockService.createSpecialization).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/specialization/search']);
  }));

  it('should show error message when specialization creation fails', fakeAsync(() => {
    const errorResponse = { message: 'Error creating specialization' };

    mockService.createSpecialization.and.returnValue(throwError(() => errorResponse));

    component.createForm.patchValue({
      code: 'GEN',
      name: 'General Medicine',
      description: 'General medicine specialization',
    });

    component.createSpecialization();
    tick();

    expect(mockToastr.error).toHaveBeenCalledWith('Error creating specialization:\nError creating specialization', 'Error');
  }));

  it('should mark all fields as touched if form is invalid', () => {
    component.createForm.patchValue({
      code: '',
      name: '',
      description: '',
    });

    component.createSpecialization();

    expect(component.createForm.touched).toBeTrue();
    expect(mockToastr.warning).toHaveBeenCalledWith('Please fill out the form correctly.', 'Warning');
  });
});
