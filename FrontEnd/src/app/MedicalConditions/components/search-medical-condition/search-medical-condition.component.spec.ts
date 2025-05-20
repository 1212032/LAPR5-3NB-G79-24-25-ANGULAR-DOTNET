import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SearchMedicalConditionComponent } from './search-medical-condition.component';
import { MedicalConditionService } from '../../services/medical-condition.service';
import { ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { MedicalConditionDto } from '../../dto/medicalConditionDto';

describe('SearchMedicalConditionComponent', () => {
    let component: SearchMedicalConditionComponent;
    let fixture: ComponentFixture<SearchMedicalConditionComponent>;
    let router: jasmine.SpyObj<Router>;
    let mockService: jasmine.SpyObj<MedicalConditionService>;
    let mockToastrService: jasmine.SpyObj<ToastrService>;

    beforeEach(async () => {
        router = jasmine.createSpyObj('Router', ['navigate']);
        mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
        mockService = jasmine.createSpyObj('MedicalConditionService', ['getMedicalConditions']);

        TestBed.configureTestingModule({
            imports: [SearchMedicalConditionComponent, ReactiveFormsModule, CommonModule, MatSortModule, RouterOutlet, BrowserAnimationsModule],
            providers: [
                { provide: ToastrService, useValue: mockToastrService },
                { provide: MedicalConditionService, useValue: mockService },
                { provide: Router, useValue: router },
                provideHttpClient(),
            ]
        });

        mockService = TestBed.inject(MedicalConditionService) as jasmine.SpyObj<MedicalConditionService>;
        mockToastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

        fixture = TestBed.createComponent(SearchMedicalConditionComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should sort data correctly', () => {
        component.medicalConditionList = [
            {
                id: '2',
                code: '2',
                name: 'Medical Condition 2',
                description: 'Medical Condition description',
                symptoms: ['A', 'B']
            },
            {
                id: '1',
                code: '1',
                name: 'Medical Condition 1',
                description: 'Medical Condition description',
                symptoms: ['A', 'B']
            }
        ];

        component.sortData({ active: 'code', direction: 'asc' });
        expect(component.medicalConditionList[0].code).toBe('1');

        component.sortData({ active: 'code', direction: 'desc' });
        expect(component.medicalConditionList[0].code).toBe('2');
    });


    it('should navigate to update page when updateMedicalCondition is called', () => {
        const mockMedicalCondition: MedicalConditionDto = {
            id: '1',
            code: '1',
            name: 'Medical Condition 1',
            description: 'Medical Condition description',
            symptoms: ['A', 'B']
        };
        component.updateMedicalCondition(mockMedicalCondition);

        expect(router.navigate).toHaveBeenCalledWith(['/admin/medicalcondition/update', mockMedicalCondition.id]);
    });

    describe('Search medical conditions with filters', () => {
        it('should search with filters', () => {
            component.filtersForm.setValue({
                code: '1',
                name: 'Medical Condition 1'
            });
            let medicalConditionDto: MedicalConditionDto = {
                id: '1',
                code: '1',
                name: 'Medical Condition 1',
                description: 'Medical Condition description',
                symptoms: ['A', 'B']
            };

            component.medicalConditionList = [medicalConditionDto];

            mockService.getMedicalConditions.and.returnValue(of([medicalConditionDto]));
            component.getMedicalConditions();

            expect(mockService.getMedicalConditions).toHaveBeenCalled();
            expect(component.medicalConditionList[0].code).toEqual('1');
        });

        it('should handle empty search results', () => {
            component.filtersForm.setValue({
                code: '1',
                name: 'Medical Condition 1'
            });
            component.medicalConditionList = [];

            mockService.getMedicalConditions.and.returnValue(of([]));
            component.getMedicalConditions();

            expect(mockService.getMedicalConditions).toHaveBeenCalled();
            expect(component.medicalConditionList.length).toBe(0);
        });
    });

});