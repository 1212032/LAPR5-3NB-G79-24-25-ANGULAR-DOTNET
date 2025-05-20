import { Routes } from '@angular/router';
import { MenuAdminComponent } from './menus/menu-admin/menu-admin.component';
import { MenuPatientComponent } from './menus/menu-patient/menu-patient.component';
import { MenuDoctorComponent } from './menus/menu-doctor/menu-doctor.component';

import { CreatePatientComponent } from './Patients/components/create-patient/create-patient.component';
import { UpdatePatientComponent } from './Patients/components/update-patient/update-patient.component';
import { SearchPatientComponent } from './Patients/components/search-patient/search-patient.component';

import { UpdatePatientUserComponent } from './PatientUser/components/update-patient/update-patient-user.component';
import { DeletePatientUserComponent } from './PatientUser/components/delete-patient/delete-patient-user.component';

import { CreateOperationRequestComponent } from './OperationRequests/components/create-operation-request/create-operation-request.component';
import { UpdateOperationRequestComponent } from './OperationRequests/components/update-operation-request/update-operation-request.component';
import { SearchOperationRequestComponent } from './OperationRequests/components/search-operation-request/search-operation-request.component';

import { CreateStaffComponent } from './Staff/components/create-staff/create-staff.component';
import { UpdateStaffComponent } from './Staff/components/update-staff/update-staff.component';
import { SearchStaffComponent } from './Staff/components/search-staff/search-staff.component';

import { CreateOperationTypeComponent } from './OperationTypes/components/create-operation-type/create-operation-type.component';
import { UpdateOperationTypeComponent } from './OperationTypes/components/update-operation-type/update-operation-type.component';
import { SearchOperationTypeComponent } from './OperationTypes/components/search-operation-type/search-operation-type.component';

import { CreateAllergyComponent } from './Allergies/components/create-allergy/create-allergy.component';
import { UpdateAllergyComponent } from './Allergies/components/update-allergy/update-allergy.component';
import { SearchAllergyComponent } from './Allergies/components/search-allergy/search-allergy.component';

import { CreateMedicalConditionComponent } from './MedicalConditions/components/create-medical-condition/create-medical-condition.component';
import { UpdateMedicalConditionComponent } from './MedicalConditions/components/update-medical-condition/update-medical-condition.component';
import { SearchMedicalConditionComponent } from './MedicalConditions/components/search-medical-condition/search-medical-condition.component';

import { CreateSpecializationsComponent } from './Specializations/components/create-specializations/create-specializations.component';
import { UpdateSpecializationsComponent } from './Specializations/components/update-specializations/update-specializations.component';
import { SearchSpecializationsComponent } from './Specializations/components/search-specializations/search-specializations.component';

import { CreateSurgeryRoomComponent } from './SurgeryRooms/components/create-surgery-room/create-surgery-room.component';

import { CreateAppointmentComponent } from './Appointments/components/create-appointment/create-appointment.component';
import { UpdateAppointmentComponent } from './Appointments/components/update-appointment/update-appointment.component';
import { SearchAppointmentComponent } from './Appointments/components/search-appointment/search-appointment.component';

import { DownloadMedicalHistoryComponent } from './PatientUser/components/download-medical-history/download-medical-history.component';

import { LogInComponent } from './log-in/log-in.component';
import { authGuard } from './Shared/guards/auth-guard.guard';
import { roleGuard } from './Shared/guards/role.guard';
import { SearchRequestsComponent } from './PatientUser/components/search-requests/search-requests.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LogInComponent },
    {
        path: 'doctor', component: MenuDoctorComponent, canActivate: [authGuard, roleGuard], data: { expectedRole: 'Doctor' }, children: [
            { path: 'operationrequest', redirectTo: 'operationrequest/search', pathMatch: 'full' },
            { path: 'operationrequest/create', component: CreateOperationRequestComponent },
            { path: 'operationrequest/update/:id', component: UpdateOperationRequestComponent },
            { path: 'operationrequest/search', component: SearchOperationRequestComponent },

            { path: 'appointment', redirectTo: 'appointment/search', pathMatch: 'full' },
            { path: 'appointment/create/:id', component: CreateAppointmentComponent },
            { path: 'appointment/update/:id', component: UpdateAppointmentComponent },
            { path: 'appointment/search', component: SearchAppointmentComponent },

            { path: 'patient', redirectTo: 'patient/search', pathMatch: 'full' },
            { path: 'patient/update/:id', component: UpdatePatientComponent },
            { path: 'patient/search', component: SearchPatientComponent },
        ]
    },
    {
        path: 'admin', component: MenuAdminComponent, canActivate: [authGuard, roleGuard], data: { expectedRole: 'Admin' }, children: [
            { path: 'staff', redirectTo: 'staff/search', pathMatch: 'full' },
            { path: 'staff/create', component: CreateStaffComponent },
            { path: 'staff/update/:id', component: UpdateStaffComponent },
            { path: 'staff/search', component: SearchStaffComponent },

            { path: 'operationtype', redirectTo: 'operationtype/search', pathMatch: 'full' },
            { path: 'operationtype/create', component: CreateOperationTypeComponent },
            { path: 'operationtype/update/:id', component: UpdateOperationTypeComponent },
            { path: 'operationtype/search', component: SearchOperationTypeComponent },

            { path: 'patient', redirectTo: 'patient/search', pathMatch: 'full' },
            { path: 'patient/create', component: CreatePatientComponent },
            { path: 'patient/update/:id', component: UpdatePatientComponent },
            { path: 'patient/search', component: SearchPatientComponent },

            { path: 'allergy', redirectTo: 'allergy/search', pathMatch: 'full' },
            { path: 'allergy/create', component: CreateAllergyComponent },
            { path: 'allergy/update/:id', component: UpdateAllergyComponent },
            { path: 'allergy/search', component: SearchAllergyComponent },

            { path: 'medicalcondition', redirectTo: 'medicalcondition/search', pathMatch: 'full' },
            { path: 'medicalcondition/create', component: CreateMedicalConditionComponent },
            { path: 'medicalcondition/update/:id', component: UpdateMedicalConditionComponent },
            { path: 'medicalcondition/search', component: SearchMedicalConditionComponent },

            { path: 'specialization', redirectTo: 'specialization/search', pathMatch: 'full' },
            { path: 'specialization/create', component: CreateSpecializationsComponent },
            { path: 'specialization/update/:id', component: UpdateSpecializationsComponent },
            { path: 'specialization/search', component: SearchSpecializationsComponent },

            { path: 'room', redirectTo: 'room/create', pathMatch: 'full' },
            { path: 'room/create', component: CreateSurgeryRoomComponent },

            { path: 'patientrequests', component: SearchRequestsComponent },
        ]
    },
    {
        path: 'patient', component: MenuPatientComponent, canActivate: [authGuard, roleGuard], data: { expectedRole: '' }, children: [
            { path: '', redirectTo: 'update', pathMatch: 'full' },
            { path: 'update', component: UpdatePatientUserComponent },
            { path: 'delete', component: DeletePatientUserComponent },
            { path: 'download-medical-history', component: DownloadMedicalHistoryComponent },
        ]
    }
];
