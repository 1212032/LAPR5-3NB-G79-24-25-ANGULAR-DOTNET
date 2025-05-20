import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { SpecializationsDto } from '../../dto/specializationsDto';
import { SearchSpecializationsComponent } from './search-specializations.component';

describe('SearchSpecializationsComponent', () => {
  let component: SearchSpecializationsComponent;
  let fixture: ComponentFixture<SearchSpecializationsComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockToastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error', 'warning']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        CommonModule,
        SearchSpecializationsComponent,
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ToastrService, useValue: mockToastr },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchSpecializationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.searchForm).toBeTruthy();
    expect(component.searchForm.value).toEqual({ code: '', name: '', description: '' });
  });

  it('should handle empty search results gracefully', fakeAsync(() => {
    spyOn(component['specializationService'], 'searchSpecializations').and.returnValue(of([]));
  
    component.searchForm.setValue({ code: 'XYZ', name: 'Unknown', description: '' });
    component.searchSpecializations();
    tick();
  
    expect(component.specializations.length).toBe(0);
    expect(mockToastr.success).toHaveBeenCalledWith('No specializations found.', 'Success');
  }));
  
  
});
