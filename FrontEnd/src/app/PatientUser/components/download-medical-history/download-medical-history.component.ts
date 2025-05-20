import { Component, OnInit } from '@angular/core';
import { PatientUserService } from '../../services/patientUser.service';
import { PatientDto } from '../../dto/patientDto';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import MedicalRecordDTO from '../../../MedicalRecord/dto/MedicalRecordDTO';
import { MedicalRecordService } from '../../../MedicalRecord/services/medical-record.service';
import { MedicalConditionDto } from '../../../MedicalConditions/dto/medicalConditionDto';
import { AllergyDto } from '../../../Allergies/dto/allergyDto';
import { AllergyService } from '../../../Allergies/services/allergy.service';
import { MedicalConditionService } from '../../../MedicalConditions/services/medical-condition.service';
import { PatientMedicalRecordDto } from '../../dto/patientMedicalRecordDto';

@Component({
  selector: 'app-download-medical-history',
  templateUrl: './download-medical-history.component.html',
  styleUrl: './download-medical-history.component.css',
})
export class DownloadMedicalHistoryComponent implements OnInit {
  patient!: PatientDto;
  patientMedicalRecord: PatientMedicalRecordDto = {
    allergies: [],
    allergiesDescriptions: [],
    medicalConditions: [],
    medicalConditionsDescriptions: [],
    freeTexts: [],
  };

  medicalConditions!: MedicalConditionDto[];
  allergies!: AllergyDto[];
  constructor(
    private patientUserService: PatientUserService,
    private medicalRecordService: MedicalRecordService,
    private allergyService: AllergyService,
    private medicalConditionService: MedicalConditionService,
    private toastr: ToastrService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getMedicalConditions();
    await this.getAllergies();

    await this.getPatient();
  }
  private async getMedicalConditions() {
    this.medicalConditionService.getAllMedicalCondition().subscribe({
      next: async (result: MedicalConditionDto[] | null) => {
        if (result != null) {
          this.medicalConditions = result;
        } else {
          this.toastr.error('Profile not found', 'Error');
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error('Profile not found\n' + err.error.message, 'Error');
      },
    });
  }
  async getAllergies() {
    this.allergyService.getAllAllergies().subscribe({
      next: async (result: AllergyDto[] | null) => {
        if (result != null) {
          this.allergies = result;
        } else {
          this.toastr.error('Profile not found', 'Error');
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error('Profile not found\n' + err.error.message, 'Error');
      },
    });
  }
  async getPatient() {
    this.patientUserService.getPatient().subscribe({
      next: async (resultPatient: PatientDto | null) => {
        if (resultPatient != null) {
          this.patient = resultPatient;

          await this.getMedicalRecord();
        } else {
          this.toastr.error('Profile not found', 'Error');
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error('Profile not found\n' + err.error.message, 'Error');
      },
    });
  }
  async getMedicalRecord() {
    if (!this.patient) {
      await this.getPatient();
    }

    this.medicalRecordService.getMedicalRecord(this.patient.id).subscribe({
      next: (dto: MedicalRecordDTO | null) => {
        if (dto != null) {
          const medicalConditionListDto = dto.medicalConditions;
          //populate medical conditions
          if (medicalConditionListDto) {
            for (let i = 0; i < medicalConditionListDto.length; i++) {
              const medicalCondition = medicalConditionListDto[i];

              if (this.medicalConditions) {
                const medicalConditionsFound = this.medicalConditions.filter(
                  (mc) => mc.id === medicalCondition.medicalConditionId
                );

                if (medicalConditionsFound && medicalConditionsFound.length > 0) {
                  this.patientMedicalRecord.medicalConditions.push(
                    medicalConditionsFound[0]
                  );
                  this.patientMedicalRecord.medicalConditionsDescriptions.push(
                    medicalCondition.description
                  );
                }
              }
            }
          }

          const allergiesListDto = dto.allergies;
          //populate allergies
          if (allergiesListDto) {
            for (let i = 0; i < allergiesListDto.length; i++) {
              const allergy = allergiesListDto[i];

              if (this.allergies) {
                const allergiesFound = this.allergies.filter(
                  (allergyItem) => allergyItem.id === allergy.allergyId
                );

                if (allergiesFound && allergiesFound.length > 0) {
                  this.patientMedicalRecord.allergies.push(allergiesFound[0]);
                  this.patientMedicalRecord.allergiesDescriptions.push(
                    allergy.description
                  );
                }
              }
            }
          }

          this.patientMedicalRecord.freeTexts = dto.freeTexts;
        } else {
          this.toastr.error('Profile not found', 'Error');
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error('Profile not found\n' + err.error.message, 'Error');
      },
    });
  }

  async downloadMedicalHistory() {
    if (!this.patientMedicalRecord) {
      await this.getMedicalRecord();
    }
    if (!this.patient == null) {
      await this.getPatient();
    }
    let fileContent = this.fileContentToDownload();

    this.downloadFile(fileContent);
  }
  downloadFile(csvContent: string) {
    const blob = new Blob([csvContent], { type: 'text/csv' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);

    link.download = 'medicalHistory' + this.patient.id + '.txt';

    link.click();

    window.URL.revokeObjectURL(link.href);
  }
  fileContentToDownload(): string {
    let fileContent = '';
    fileContent += '##########################################\n\n';
    fileContent += this.patientToString();
    fileContent += '\n\n##########################################\n\n';

    fileContent += this.medicalRecordToString();

    fileContent += '\n\n##########################################\n\n';
    this.patientMedicalRecord.freeTexts.forEach((element, index) => {
      let newVal = this.convertHtmlToString(element);
      fileContent += newVal + "\n\n";
    });
    return fileContent;
  }
  patientToString(): string {
    let patientString = '##Patient data\n\n';

    patientString += 'firstName: ' + this.patient.firstName + '\n';
    patientString += 'lastName: ' + this.patient.lastName + '\n';
    patientString +=
      'emergencyContact: ' + this.patient.emergencyContact + '\n';
    patientString += 'gender: ' + this.patient.gender + '\n';
    patientString += 'dateOfBirth: ' + this.patient.dateOfBirth + '\n';
    patientString += 'email: ' + this.patient.email + '\n';
    patientString += 'phone: ' + this.patient.phone + '\n';
    patientString += 'address: ' + this.patient.address + '\n';

    return patientString;
  }
  medicalRecordToString(): string {
    let mrString = '';
    if (this.patientMedicalRecord.allergies.length > 0) {
      mrString += '##Allergies\n\n';
    }
    this.patientMedicalRecord.allergies.forEach((element, index) => {
      mrString += 'code: ' + element.code + '\n';
      mrString += 'name: ' + element.name + '\n';
      mrString +=
        'description: ' +
        this.patientMedicalRecord.allergiesDescriptions[index] +
        '\n';
    });
    if (this.patientMedicalRecord.medicalConditions.length > 0) {
      mrString += '\n\n##MedicalConditions\n\n';
    }
    this.patientMedicalRecord.medicalConditions.forEach((element, index) => {
      mrString += 'code: ' + element.code + '\n';
      mrString += 'name: ' + element.name + '\n';
      mrString +=
        'description: ' +
        this.patientMedicalRecord.medicalConditionsDescriptions[index] +
        '\n';
    });
    return mrString;
  }
  convertHtmlToString(htmlString: string): string {
    let textContent = htmlString; //tempDiv.textContent || tempDiv.innerText || '';
    // Replace non-breaking spaces with regular spaces
    textContent = textContent.replace(/\u00A0/g, ' ');
    // Convert <p> tags to new lines for separation between paragraphs
    textContent = textContent.replace(/<\/p>/g, '\n</p>');
    // Convert <li> tags to new lines for list items
    textContent = textContent.replace(/<\/li>/g, '\n</p>');
    // Replace any heading tags <h1>, <h2>, <h3>, ..., <h6> with the appropriate markdown-style header
    textContent = textContent.replace(/<h(\d)>/g, (match, level) => {
      return `\n${'#'.repeat(7 - parseInt(level))} `;
    });
    // Replace closing heading tags </h1>, </h2>, ..., </h6> with new lines
    textContent = textContent.replace(/<\/h\d>/g, '\n</hd>');
    // Remove other tags (if any) and ensure spaces between elements
    textContent = textContent.replace(/<[^>]+>/g, '').trim();

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = textContent;

    // Replace non-breaking spaces with regular spaces
    return tempDiv.textContent || tempDiv.innerText || '';
  }
}
