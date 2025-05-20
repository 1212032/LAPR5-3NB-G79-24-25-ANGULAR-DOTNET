import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateMedicalRecordComponent } from './update-medical-record.component';
import { MedicalConditionService } from '../../../MedicalConditions/services/medical-condition.service';
import { AllergyService } from '../../../Allergies/services/allergy.service';
import { MedicalRecordService } from '../../services/medical-record.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ListMedicalConditionComponent } from '../../../MedicalConditions/components/list-medical-condition/list-medical-condition.component';
import { ListAllergyComponent } from '../../../Allergies/components/list-allergy/list-allergy.component';
import { RichTextComponent } from '../rich-text/rich-text.component';
import { QuillEditorComponent } from 'ngx-quill';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UpdateMedicalRecordComponent', () => {
    let component: UpdateMedicalRecordComponent;
    let fixture: ComponentFixture<UpdateMedicalRecordComponent>;
    let mockMedicalConditionService: any;
    let mockAllergyService: any;
    let mockMedicalRecordService: any;
    let mockToastrService: any;
    let mockActivatedRoute: any;
    let mockRouter: any;

    beforeEach(async () => {
        mockMedicalConditionService = {
            getAllMedicalCondition: jasmine.createSpy('getAllMedicalCondition').and.returnValue(of([])),
        };

        mockAllergyService = {
            getAllAllergies: jasmine.createSpy('getAllAllergies').and.returnValue(of([])),
        };

        mockMedicalRecordService = {
            getMedicalRecord: jasmine.createSpy('getMedicalRecord').and.returnValue(of({
                allergies: [],
                medicalConditions: [],
                freeTexts: [],
            })),
            updateMedicalRecord: jasmine.createSpy('updateMedicalRecord').and.returnValue(of({})),
        };

        mockToastrService = {
            error: jasmine.createSpy('error'),
            success: jasmine.createSpy('success'),
        };

        mockActivatedRoute = {
            params: of({ id: '1' }),
        };

        mockRouter = {
            navigate: jasmine.createSpy('navigate'),
        };

        await TestBed.configureTestingModule({
            imports: [UpdateMedicalRecordComponent, ReactiveFormsModule, CommonModule, ListMedicalConditionComponent,
                ListAllergyComponent, RichTextComponent, QuillEditorComponent, BrowserAnimationsModule],
            providers: [
                { provide: MedicalConditionService, useValue: mockMedicalConditionService },
                { provide: AllergyService, useValue: mockAllergyService },
                { provide: MedicalRecordService, useValue: mockMedicalRecordService },
                { provide: ToastrService, useValue: mockToastrService },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: Router, useValue: mockRouter },
                provideHttpClient(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateMedicalRecordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize patientId from route params', () => {
        component.ngOnInit();
        expect(component.patientId).toBe('1');
    });

    it('should call getAllMedicalConditions and getAllAllergies on init', async () => {
        spyOn(component, 'getAllMedicalConditions').and.callThrough();
        spyOn(component, 'getAllAllergies').and.callThrough();

        await component.ngOnInit();

        expect(mockMedicalConditionService.getAllMedicalCondition).toHaveBeenCalled();
        expect(mockAllergyService.getAllAllergies).toHaveBeenCalled();
    });

    it('should call populateMedicalRecord after fetching allergies', async () => {
        spyOn(component, 'populateMedicalRecord').and.callThrough();

        await component.getAllAllergies();

        expect(component.populateMedicalRecord).toHaveBeenCalled();
    });

    it('should handle error when fetching medical record fails', async () => {
        const errorResponse = { error: { message: 'Error fetching data' } };
        mockMedicalRecordService.getMedicalRecord.and.returnValue(throwError(errorResponse));

        await component.populateMedicalRecord();

        expect(mockToastrService.error).toHaveBeenCalledWith('Failed to fetch medical record: Error fetching data', 'Error');
    });

    it('should successfully update medical record and show success message', () => {
        component.updateMedicalRecord();

        expect(mockMedicalRecordService.updateMedicalRecord).toHaveBeenCalled();
        expect(mockToastrService.success).toHaveBeenCalledWith('Medical record updated successfully', 'Success');
    });

    it('should handle error when updating medical record fails', () => {
        const errorResponse = { error: { message: 'Error updating medical record' } };
        mockMedicalRecordService.updateMedicalRecord.and.returnValue(throwError(errorResponse));

        component.updateMedicalRecord();

        expect(mockToastrService.error).toHaveBeenCalledWith('Failed to update medical record\nError updating medical record', 'Error');
    });


    it('should add new allergy', () => {
        component.addAllergy();
        expect(component.allergiesIndexes.length).toBe(1);
    });

    it('should remove allergy', () => {
        component.addAllergy();
        component.removeAllergy(0);
        expect(component.allergiesIndexes.length).toBe(0);
    });

    it('should add new medical condition', () => {
        component.addMedicalCondition();
        expect(component.medicalConditionsIndexes.length).toBe(1);
    });

    it('should remove medical condition', () => {
        component.addMedicalCondition();
        component.removeMedicalCondition(0);
        expect(component.medicalConditionsIndexes.length).toBe(0);
    });

    it('should add new free-text editor', () => {
        component.addNewRichtText();
        expect(component.editors.length).toBe(1);
    });

    it('should remove free-text editor', () => {
        component.addNewRichtText();
        component.removeRichtText(0);
        expect(component.editors.length).toBe(0);
    });


    it('should filter allergy', () => {
        component.addAllergy();
        expect(component.allergiesIndexes.length).toBe(1);
        component.onAllergySelected({ id: '1', code: '1', name: 'name', description: 'description' }, 0);

        component.addAllergy();
        expect(component.allergiesIndexes.length).toBe(2);
        component.onAllergySelected({ id: '2', code: '2', name: 'name', description: 'description' }, 1);

        component.filterAllergy({ id: '1', code: '1', name: 'name', description: 'description' });
        expect(component.allergiesVisible[0]).toBe(true);
        expect(component.allergiesVisible[1]).toBe(false);
    });

    it('should disable allergy filter', () => {
        component.addAllergy();
        component.onAllergySelected({ id: '1', code: '1', name: 'name', description: 'description' }, 0);
        component.addAllergy();
        component.onAllergySelected({ id: '2', code: '2', name: 'name', description: 'description' }, 1);
        component.filterAllergy({ id: '1', code: '1', name: 'name', description: 'description' });

        component.deactivateAllergyFilter();
        expect(component.allergiesVisible[0]).toBe(true);
        expect(component.allergiesVisible[1]).toBe(true);
    });

    it('should filter medical condition', () => {
        component.addMedicalCondition();
        expect(component.medicalConditionsIndexes.length).toBe(1);
        component.onMedicalConditionSelected({ id: '1', code: '1', name: 'name', description: 'description', symptoms: [] }, 0);

        component.addMedicalCondition();
        expect(component.medicalConditionsIndexes.length).toBe(2);
        component.onMedicalConditionSelected({ id: '2', code: '2', name: 'name', description: 'description', symptoms: [] }, 1);

        component.filterMedicalCondition({ id: '1', code: '1', name: 'name', description: 'description', symptoms: [] });
        expect(component.medicalConditionsVisible[0]).toBe(true);
        expect(component.medicalConditionsVisible[1]).toBe(false);
    });

    it('should disable medical condition filter', () => {
        component.addMedicalCondition();
        component.onMedicalConditionSelected({ id: '1', code: '1', name: 'name', description: 'description', symptoms: [] }, 0);
        component.addMedicalCondition();
        component.onMedicalConditionSelected({ id: '2', code: '2', name: 'name', description: 'description', symptoms: [] }, 1);
        component.filterMedicalCondition({ id: '1', code: '1', name: 'name', description: 'description', symptoms: [] });

        component.deactivateMedicalConditionFilter();
        expect(component.medicalConditionsVisible[0]).toBe(true);
        expect(component.medicalConditionsVisible[1]).toBe(true);
    });

    it('should filter text', () => {
        component.addNewRichtText();
        expect(component.editors.length).toBe(1);
        component.updateContent('123', 0);

        component.addNewRichtText();
        expect(component.editors.length).toBe(2);
        component.updateContent('456', 1);

        component.filterEditors({ target: { value: '4' } });
        expect(component.editorsVisible[0]).toBe(false);
        expect(component.editorsVisible[1]).toBe(true);
    });

    it('should disable text filter', () => {
        component.addNewRichtText();
        component.updateContent('123', 0);
        component.addNewRichtText();
        component.updateContent('456', 1);
        component.filterEditors({ target: { value: '4' } });

        component.deactivateEditorFilter();
        expect(component.editorsVisible[0]).toBe(true);
        expect(component.editorsVisible[1]).toBe(true);
    });
});
