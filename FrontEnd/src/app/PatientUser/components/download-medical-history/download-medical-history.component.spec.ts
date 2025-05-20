import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DownloadMedicalHistoryComponent } from './download-medical-history.component';
import { PatientUserService } from '../../services/patientUser.service';
import { MedicalRecordService } from '../../../MedicalRecord/services/medical-record.service';
import { AllergyService } from '../../../Allergies/services/allergy.service';
import { MedicalConditionService } from '../../../MedicalConditions/services/medical-condition.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { PatientDto } from '../../dto/patientDto';
import MedicalRecordDTO from '../../../MedicalRecord/dto/MedicalRecordDTO';
import { AllergyDto } from '../../../Allergies/dto/allergyDto';
import { MedicalConditionDto } from '../../../MedicalConditions/dto/medicalConditionDto';

describe('DownloadMedicalHistoryComponent', () => {
  let component: DownloadMedicalHistoryComponent;
  let fixture: ComponentFixture<DownloadMedicalHistoryComponent>;
  let patientUserServiceMock: any;
  let medicalRecordServiceMock: any;
  let allergyServiceMock: any;
  let medicalConditionServiceMock: any;
  let toastrMock: any;

  beforeEach(() => {
    patientUserServiceMock = {
      getPatient: jasmine.createSpy('getPatient').and.returnValue(of({})),
    };

    medicalRecordServiceMock = {
      getMedicalRecord: jasmine
        .createSpy('getMedicalRecord')
        .and.returnValue(of({})),
    };
    allergyServiceMock ={
      getAllAllergies: jasmine.createSpy('getAllAllergies').and.returnValue(of([]))
    };
    medicalConditionServiceMock={
      getAllMedicalCondition: jasmine.createSpy('getAllMedicalCondition').and.returnValue(of([]))
    }
    

    toastrMock = {
      error: jasmine.createSpy('error'),
      success: jasmine.createSpy('success'),
    };

    TestBed.configureTestingModule({
      declarations: [DownloadMedicalHistoryComponent],
      providers: [
        { provide: PatientUserService, useValue: patientUserServiceMock },
        { provide: MedicalRecordService, useValue: medicalRecordServiceMock },
        { provide: AllergyService, useValue: allergyServiceMock },
        {
          provide: MedicalConditionService,
          useValue: medicalConditionServiceMock,
        },
        { provide: ToastrService, useValue: toastrMock },
      ],
    });

    fixture = TestBed.createComponent(DownloadMedicalHistoryComponent);
    component = fixture.componentInstance;
  });

  it('should call services on ngOnInit', async () => {
    const getPatientSpy = patientUserServiceMock.getPatient.and.returnValue(
      of({
        id: '1',
        firstName: 'Carlos',
        lastName: 'Silva',
        emergencyContact: '987630132',
        gender: 'Male',
        dateOfBirth: new Date(),
        email: 'email@email.com',
        phone: '12345',
        address: 'Rua das povoas',
        medicalRecord: '2',
      })
    );
    const getMedicalConditionsSpy =
      medicalConditionServiceMock.getAllMedicalCondition.and.returnValue(
        of([])
      );
    const getAllergiesSpy = allergyServiceMock.getAllAllergies.and.returnValue(
      of([])
    );

    await component.ngOnInit();

    expect(getPatientSpy).toHaveBeenCalled();
    expect(getMedicalConditionsSpy).toHaveBeenCalled();
    expect(getAllergiesSpy).toHaveBeenCalled();
  });
  it('should correctly convert HTML to plain text', () => {
    const htmlString = '<h1>Title</h1><p>Some content.</p>';
    const result = component.convertHtmlToString(htmlString);

    expect(result).toBe('###### Title\nSome content.');
  });
  it('should download the medical history file', async () => {
    const patientMock: PatientDto = {
      id: '1',
      firstName: 'Carlos',
      lastName: 'Silva',
      emergencyContact: '987630132',
      gender: 'Male',
      dateOfBirth: new Date(),
      email: 'email@email.com',
      phone: '12345',
      address: 'Rua das povoas',
      medicalRecord: '2',
    };
    const medicalRecordMock: MedicalRecordDTO = {
      id: '',
      patientId: '',
      freeTexts: ['Patient has asthma'],
      allergies: [{ allergyId: 'a1', description: 'Pollen' }],
      medicalConditions: [{ medicalConditionId: 'mc1', description: 'Asthma' }],
    };
    const allergiesMock: AllergyDto[] = [
      {
        id: 'a1',
        code: '09DA',
        name: 'Pollen',
        description: 'Allergy to pollen',
      },
    ];
    const medicalConditionsMock: MedicalConditionDto[] = [
      {
        id: 'mc1',
        code: '02BC',
        name: 'Asthma',
        description: 'Weak breath',
        symptoms: [],
      },
    ];

    patientUserServiceMock.getPatient.and.returnValue(of(patientMock));
    medicalRecordServiceMock.getMedicalRecord.and.returnValue(
      of(medicalRecordMock)
    );
    allergyServiceMock.getAllAllergies.and.returnValue(of(allergiesMock));
    medicalConditionServiceMock.getAllMedicalCondition.and.returnValue(
      of(medicalConditionsMock)
    );

    await component.getPatient();
    await component.getMedicalRecord();

    const downloadFileSpy = spyOn(component, 'downloadFile');
    component.downloadMedicalHistory();

    expect(downloadFileSpy).toHaveBeenCalled();
  });
});
