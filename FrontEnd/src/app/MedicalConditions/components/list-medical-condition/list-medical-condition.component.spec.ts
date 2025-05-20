import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MedicalConditionService } from '../../services/medical-condition.service';
import { ListMedicalConditionComponent } from '../list-medical-condition/list-medical-condition.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ListMedicalConditionComponent', () => {
    let component: ListMedicalConditionComponent;
    let fixture: ComponentFixture<ListMedicalConditionComponent>;
    let mockService: jasmine.SpyObj<MedicalConditionService>;
    let mockToastr: jasmine.SpyObj<ToastrService>;

    beforeEach(async () => {
        mockService = jasmine.createSpyObj('MedicalConditionService', [
            'createMedicalCondition',
        ]);
        mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error']);

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, BrowserAnimationsModule, ListMedicalConditionComponent],
            providers: [
                { provide: MedicalConditionService, useValue: mockService },
                { provide: ToastrService, useValue: mockToastr },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ListMedicalConditionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});