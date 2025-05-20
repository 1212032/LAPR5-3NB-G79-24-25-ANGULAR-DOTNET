import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SearchAllergyComponent } from './search-allergy.component';
import { AllergyService } from '../../services/allergy.service';
import { ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { AllergyDto } from '../../dto/allergyDto';


describe('SearchAllergyComponent', () => {
    let component: SearchAllergyComponent;
    let fixture: ComponentFixture<SearchAllergyComponent>;
    let router: jasmine.SpyObj<Router>;
    let mockService: jasmine.SpyObj<AllergyService>;
    let mockToastrService: jasmine.SpyObj<ToastrService>;

    beforeEach(async () => {
        router = jasmine.createSpyObj('Router', ['navigate']);
        mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
        mockService = jasmine.createSpyObj('AllergyService', ['getAllergies']);

        TestBed.configureTestingModule({
            imports: [SearchAllergyComponent, ReactiveFormsModule, CommonModule, MatSortModule, RouterOutlet, BrowserAnimationsModule],
            providers: [
                { provide: ToastrService, useValue: mockToastrService },
                { provide: AllergyService, useValue: mockService },
                { provide: Router, useValue: router },
                provideHttpClient(),
            ]
        });

        mockService = TestBed.inject(AllergyService) as jasmine.SpyObj<AllergyService>;
        mockToastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

        fixture = TestBed.createComponent(SearchAllergyComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should sort data correctly', () => {
        component.allergyList = [
            {
                id: '2',
                code: '2',
                name: 'Allergy 2',
                description: 'Allergy description'
            },
            {
                id: '1',
                code: '1',
                name: 'Allergy 1',
                description: 'Allergy description'
            }
        ];

        component.sortData({ active: 'code', direction: 'asc' });
        expect(component.allergyList[0].code).toBe('1');

        component.sortData({ active: 'code', direction: 'desc' });
        expect(component.allergyList[0].code).toBe('2');
    });


    it('should navigate to update page when updateAllergy is called', () => {
        const mockAllergy: AllergyDto = {
            id: '1',
            code: '1',
            name: 'Allergy 1',
            description: 'Allergy description'
        };
        component.updateAllergy(mockAllergy);

        expect(router.navigate).toHaveBeenCalledWith(['/admin/allergy/update', mockAllergy.id]);
    });

    describe('Search allergies with filters', () => {
        it('should search with filters', () => {
            component.filtersForm.setValue({
                code: '1',
                name: 'Allergy 1'
            });
            let allergyDto: AllergyDto = {
                id: '1',
                code: '1',
                name: 'Allergy 1',
                description: 'Allergy description'
            };

            component.allergyList = [allergyDto];

            mockService.getAllergies.and.returnValue(of([allergyDto]));
            component.getAllergies();

            expect(mockService.getAllergies).toHaveBeenCalled();
            expect(component.allergyList[0].code).toEqual('1');
        });

        it('should handle empty search results', () => {
            component.filtersForm.setValue({
                code: '1',
                name: 'Allergy 1'
            });
            component.allergyList = [];

            mockService.getAllergies.and.returnValue(of([]));
            component.getAllergies();

            expect(mockService.getAllergies).toHaveBeenCalled();
            expect(component.allergyList.length).toBe(0);
        });
    });

});