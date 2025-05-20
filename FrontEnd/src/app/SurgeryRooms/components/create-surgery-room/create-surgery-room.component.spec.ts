import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateSurgeryRoomComponent } from './create-surgery-room.component';
import { provideHttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { SurgeryRoomService } from '../../services/surgeryRoom.service';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';


describe('CreateSurgeryRoomComponent', () => {
    let component: CreateSurgeryRoomComponent;
    let fixture: ComponentFixture<CreateSurgeryRoomComponent>;
    let mockService: any;
    let mockToastr: any;

    beforeEach(async () => {
        mockService = {
            createSurgeryRoom: jasmine.createSpy('createSurgeryRoom').and.returnValue(of([])),
        };

        mockToastr = {
            error: jasmine.createSpy('error'),
            success: jasmine.createSpy('success')
        };

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, CommonModule],
            providers: [
                { provide: SurgeryRoomService, useValue: mockService },
                { provide: ToastrService, useValue: mockToastr },
                provideHttpClient()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CreateSurgeryRoomComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form with default values', () => {
        expect(component.roomForm).toBeDefined();
        expect(component.roomForm.controls['code'].value).toBe('');
        expect(component.roomForm.controls['name'].value).toBe('');
        expect(component.roomForm.controls['description'].value).toBe('');
        expect(component.roomForm.controls['forSurgery'].value).toBe(true);
    });

    it('should update form with values', () => {
        component.roomForm.setValue({
            code: 'ABCD-123',
            name: 'Room name',
            description: 'Room description',
            forSurgery: false,
        });
        expect(component.roomForm.controls['code'].value).toBe('ABCD-123');
        expect(component.roomForm.controls['name'].value).toBe('Room name');
        expect(component.roomForm.controls['description'].value).toBe('Room description');
        expect(component.roomForm.controls['forSurgery'].value).toBe(false);
    });

    it('should create room dto', () => {
        component.roomForm.setValue({
            code: 'ABCD-123',
            name: 'Room name',
            description: 'Room description',
            forSurgery: false,
        });
        const dto = component.createDto();

        expect(dto).toEqual({
            code: 'ABCD-123',
            name: 'Room name',
            description: 'Room description',
            forSurgery: false,
        });
    });

    it('should call createRoom on form submit', () => {
        spyOn(component, 'createSurgeryRoom').and.callThrough();

        component.roomForm.setValue({
            code: "AAAA-001",
            name: "Room 1",
            description: "Longer description of the room",
            forSurgery: true
        });
        component.createSurgeryRoom();

        expect(component.createSurgeryRoom).toHaveBeenCalled;
        expect(mockService.createSurgeryRoom).toHaveBeenCalledWith({
            code: "AAAA-001",
            name: "Room 1",
            description: "Longer description of the room",
            forSurgery: true
        });
    });

    it('should show success toastr on successful room creation', () => {
        spyOn(component, 'createSurgeryRoom').and.callThrough();

        component.roomForm.setValue({
            code: "AAAA-001",
            name: "Room 1",
            description: "Longer description of the room",
            forSurgery: true
        });
        component.createSurgeryRoom();

        expect(mockToastr.success).toHaveBeenCalledWith('Room created successfully', 'Success');
    });

    it('should show error toastr on invalid room creation', () => {
        mockService.createSurgeryRoom.and.returnValue(throwError({ error: { message: 'Error' } }))
        component.createSurgeryRoom();

        expect(mockToastr.error).toHaveBeenCalledWith('Failed to create room: Error', 'Error');
    });
});