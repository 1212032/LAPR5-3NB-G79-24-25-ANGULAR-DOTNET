import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AllergyService } from '../../services/allergy.service';
import { ListAllergyComponent } from '../list-allergy/list-allergy.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ListAllergyComponent', () => {
    let component: ListAllergyComponent;
    let fixture: ComponentFixture<ListAllergyComponent>;
    let mockService: jasmine.SpyObj<AllergyService>;
    let mockToastr: jasmine.SpyObj<ToastrService>;

    beforeEach(async () => {
        mockService = jasmine.createSpyObj('AllergyService', [
            'createAllergy',
        ]);
        mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error']);

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, ListAllergyComponent, BrowserAnimationsModule],
            providers: [
                { provide: AllergyService, useValue: mockService },
                { provide: ToastrService, useValue: mockToastr },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ListAllergyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});

