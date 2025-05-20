import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchStaffComponent } from './search-staff.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { StaffService } from '../../services/staff.service';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { RouterLink, RouterOutlet } from '@angular/router';
import { StaffSpecializationDto } from '../../dto/staffSpecializationDto';
import { StaffDto } from '../../dto/staffDto';
describe('SearchStaffComponent', () => {
    let component: SearchStaffComponent;
    let fixture: ComponentFixture<SearchStaffComponent>;

    let mockService: jasmine.SpyObj<StaffService>;
    let mockToastrService: jasmine.SpyObj<ToastrService>;

    beforeEach(async () => {
        mockService = jasmine.createSpyObj('StaffService', ['getAllSpecializations', 'getStaff', 'inactivateStaff', 'updateStaff', 'inactivateStaff']);
        mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);

        await TestBed.configureTestingModule({
            imports: [
                SearchStaffComponent,
                ReactiveFormsModule,
                MatDialogModule,
                BrowserAnimationsModule,
                CommonModule,
                MatSortModule,
                RouterOutlet,
                RouterLink
            ],
            providers: [
                { provide: StaffService, useValue: mockService },
                { provide: ToastrService, useValue: mockToastrService },
                provideHttpClient()
            ]
        }).compileComponents();


        fixture = TestBed.createComponent(SearchStaffComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should sort data correctly', () => {
        component.staffList = [{
            active: true,
            fullName: 'Josefina Maria',
            id: '1',
            licenseNumber: 'M123',
            email: 'email@gmail.com',
            phone: '912334154',
            firstName: 'Josefina',
            lastName: 'Maria',
            role: 'Doctor',
            availabilitySlots: [],
            specialization: 1
        }, {
            active: true,
            fullName: 'Maria Josefina',
            id: '1',
            licenseNumber: 'M123',
            email: 'email@gmail.com',
            phone: '912334154',
            firstName: 'Maria',
            lastName: 'Josefina',
            role: 'Doctor',
            availabilitySlots: [],
            specialization: 1
        }]

        component.sortData({ active: 'fullName', direction: 'asc' });
        expect(component.staffList[0].fullName).toBe('Josefina Maria');

        component.sortData({ active: 'fullName', direction: 'desc' });
        expect(component.staffList[0].fullName).toBe('Maria Josefina');
    });
    describe('Inactivate Staff', () => {
        it('should inactivate staff', async () => {
            let staffSpecializationDto: StaffSpecializationDto = {
                active: true,
                fullName: 'Josefina Maria',
                id: '1',
                licenseNumber: 'M123',
                email: 'email@gmail.com',
                phone: '912334154',
                firstName: 'Josefina',
                lastName: 'Maria',
                role: 'Doctor',
                availabilitySlots: [],
                specialization: 1
            }
            let staffDto: StaffDto = {
                active: true,
                fullName: 'Josefina Maria',
                id: '1',
                licenseNumber: 'M123',
                email: 'email@gmail.com',
                phone: '912334154',
                firstName: 'Josefina',
                lastName: 'Maria',
                role: 'Doctor',
                availabilitySlots: [],
                specialization: 1
            }
            component.selectedStaffId = staffDto.id;
            component.selectedStaffName = staffDto.fullName;
            component.staffList = [staffDto];

            mockService.inactivateStaff.and.returnValue(of({
                active: false,
                fullName: 'Josefina Maria',
                id: '1',
                licenseNumber: 'M123',
                email: 'email@gmail.com',
                phone: '912334154',
                firstName: 'Josefina',
                lastName: 'Maria',
                role: 'Doctor',
                availabilitySlots: [],
                specialization: 1
            }));

            mockService.inactivateStaff.and.returnValue(of(staffDto));
            mockService.getStaff.withArgs(component.filtersForm.value.licenseNumber, component.filtersForm.value.name, component.filtersForm.value.role, component.filtersForm.value.specialization, component.filtersForm.value.active).and.returnValue(of(Array.of(staffDto)));
            
            component.inactivateStaff();

            expect(mockService.inactivateStaff).toHaveBeenCalledWith(component.selectedStaffId);
            expect(mockToastrService.success).toHaveBeenCalledWith('Staff inactivated successfully', 'Success');
        });
    });
});

