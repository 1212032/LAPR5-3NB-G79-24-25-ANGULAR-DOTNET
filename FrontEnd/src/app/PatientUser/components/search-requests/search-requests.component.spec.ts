import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SearchRequestsComponent } from './search-requests.component';
import { PatientUserService } from '../../services/patientUser.service';

describe('SearchRequestsComponent', () => {
    let component: SearchRequestsComponent;
    let fixture: ComponentFixture<SearchRequestsComponent>;

    let mockService: jasmine.SpyObj<PatientUserService>;
    let mockToastrService: jasmine.SpyObj<ToastrService>;

    beforeEach(async () => {
        mockService = jasmine.createSpyObj('PatientUserService', ['getPatient', 'sendPatientRequest', 'deleteRequest', 'getRequests']);
        mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);

        await TestBed.configureTestingModule({
            imports: [
                SearchRequestsComponent,
                ReactiveFormsModule,
                MatDialogModule,
                BrowserAnimationsModule,
                CommonModule,
                MatSortModule,
                RouterOutlet,
                RouterLink
            ],
            providers: [
                { provide: PatientUserService, useValue: mockService },
                { provide: ToastrService, useValue: mockToastrService },
                provideHttpClient()
            ]
        }).compileComponents();


        fixture = TestBed.createComponent(SearchRequestsComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

