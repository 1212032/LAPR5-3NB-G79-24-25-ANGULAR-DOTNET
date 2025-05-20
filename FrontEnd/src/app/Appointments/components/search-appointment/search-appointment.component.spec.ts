import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppointmentTableDto, SearchAppointmentComponent } from './search-appointment.component';
import { AppointmentService } from '../../services/appointment.service';
import { ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { AppointmentDto } from '../../dto/appointmentDto';


describe('SearchAppointmentComponent', () => {
    let component: SearchAppointmentComponent;
    let fixture: ComponentFixture<SearchAppointmentComponent>;
    let router: jasmine.SpyObj<Router>;
    let mockService: jasmine.SpyObj<AppointmentService>;
    let mockToastrService: jasmine.SpyObj<ToastrService>;

    beforeEach(async () => {
        router = jasmine.createSpyObj('Router', ['navigate']);
        mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
        mockService = jasmine.createSpyObj('AppointmentService', ['getAppointments']);

        TestBed.configureTestingModule({
            imports: [SearchAppointmentComponent, ReactiveFormsModule, CommonModule, MatSortModule, RouterOutlet, BrowserAnimationsModule],
            providers: [
                { provide: ToastrService, useValue: mockToastrService },
                { provide: AppointmentService, useValue: mockService },
                { provide: Router, useValue: router },
                provideHttpClient(),
            ]
        });

        mockService = TestBed.inject(AppointmentService) as jasmine.SpyObj<AppointmentService>;
        mockToastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

        fixture = TestBed.createComponent(SearchAppointmentComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should sort data correctly', () => {
        component.appointmentList = [
            {
                id: 1,
                patientId: '1',
                patientFullName: 'Full name',
                dateTime: new Date(2025, 1, 1).toString(),
                room: '12345678'
            },
            {
                id: 2,
                patientId: '1',
                patientFullName: 'Full name',
                dateTime: new Date(2025, 1, 1).toString(),
                room: '87654321'
            }
        ];
        component.sortData({ active: 'room', direction: 'asc' });
        expect(component.appointmentList[0].room).toBe('12345678');

        component.sortData({ active: 'room', direction: 'desc' });
        expect(component.appointmentList[0].room).toBe('87654321');
    });


    it('should navigate to update page when updateAppointment is called', () => {
        const mockAppointment: AppointmentTableDto = {
            id: 1,
            patientId: '1',
            patientFullName: 'Full name',
            dateTime: new Date(2025, 1, 1).toString(),
            room: '12345678'
        };
        component.updateAppointment(mockAppointment);

        expect(router.navigate).toHaveBeenCalledWith(['/doctor/appointment/update', mockAppointment.id]);
    });

    describe('Search appointments with filters', () => {
        it('should search with filters', () => {
            component.filtersForm.setValue({
                patientNameFilter: '',
                patientMedicalRecordNumberFilter: '',
                roomFilter: '12345678',
                priorityFilter: '',
                startDateFilter: '',
                endDateFilter: '',
                staffFilter: ''
            });
            let appointmentTableDto1: AppointmentTableDto = {
                id: 1,
                patientId: '1',
                patientFullName: 'Full name',
                dateTime: new Date(2025, 1, 1).toString(),
                room: '12345678'
            };
            let appointmentTableDto2: AppointmentTableDto = {
                id: 2,
                patientId: '1',
                patientFullName: 'Full name',
                dateTime: new Date(2025, 1, 1).toString(),
                room: '87654321'
            };
            component.appointmentList = [appointmentTableDto1, appointmentTableDto2];

            let appointmentDto: AppointmentDto = {
                status: 'scheduled',
                patientId: '1',
                patientFullName: 'Full name',
                surgeryRoomName: 'Room name',
                id: 1,
                dateTime: new Date(2025, 1, 1),
                originatingOperationRequest: 1,
                room: '12345678',
                phases: []
            };

            mockService.getAppointments.and.returnValue(of([appointmentDto]));
            component.searchWithFilters();

            expect(mockService.getAppointments).toHaveBeenCalled();
            expect(component.appointmentList[0].id).toEqual(1);
        });

        it('should handle empty search results', () => {
            component.filtersForm.setValue({
                patientNameFilter: '',
                patientMedicalRecordNumberFilter: '',
                roomFilter: '12345678',
                priorityFilter: '',
                startDateFilter: '',
                endDateFilter: '',
                staffFilter: '',
            });
            component.appointmentList = [];

            mockService.getAppointments.and.returnValue(of([]));
            component.searchWithFilters();

            expect(mockService.getAppointments).toHaveBeenCalled();
            expect(component.appointmentList.length).toBe(0);
        });
    });
});