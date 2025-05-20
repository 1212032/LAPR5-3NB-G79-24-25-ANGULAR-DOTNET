import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { RichTextComponent } from '../rich-text/rich-text.component';
import { MedicalConditionDto } from '../../../MedicalConditions/dto/medicalConditionDto';
import { AllergyDto } from '../../../Allergies/dto/allergyDto';
import { ToastrService } from 'ngx-toastr';
import MedicalRecordDTO from '../../dto/MedicalRecordDTO';
import { MedicalRecordAllergyDTO } from '../../dto/MedicalRecordAllergyDTO';
import { MedicalRecordConditionDTO } from '../../dto/MedicalRecordConditionDTO';
import { MedicalRecordService } from '../../services/medical-record.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MedicalConditionService } from '../../../MedicalConditions/services/medical-condition.service';
import { AllergyService } from '../../../Allergies/services/allergy.service';
import { ListMedicalConditionComponent } from '../../../MedicalConditions/components/list-medical-condition/list-medical-condition.component';
import { ListAllergyComponent } from '../../../Allergies/components/list-allergy/list-allergy.component';

@Component({
    selector: 'app-update-medical-record',
    standalone: true,
    imports: [RichTextComponent, ListMedicalConditionComponent, ListAllergyComponent, QuillEditorComponent,
        ReactiveFormsModule, RouterOutlet, FormsModule, CommonModule],
    templateUrl: './update-medical-record.component.html',
    styleUrl: './update-medical-record.component.css',
})
export class UpdateMedicalRecordComponent implements OnInit, OnDestroy {
    medicalRecordForm!: FormGroup;
    patientId!: string;

    allMedicalConditions: MedicalConditionDto[] = [];
    allAllergies: AllergyDto[] = [];

    observationsAllergy: string[] = [];
    observationsMedicalCondition: string[] = [];

    allergiesIndexes: number[] = [];
    allergiesList: AllergyDto[] = [];
    allergyControls: FormControl<AllergyDto | string | null>[] = [];

    allergiesVisible: boolean[] = [];
    allergyFilter: FormControl<AllergyDto | string | null> = new FormControl<AllergyDto | string>('');

    medicalConditionsIndexes: number[] = [];
    medicalConditionsList: MedicalConditionDto[] = [];
    medicalConditionControls: FormControl<MedicalConditionDto | string | null>[] = [];

    medicalConditionsVisible: boolean[] = [];
    medicalConditionFilter: FormControl<MedicalConditionDto | string | null> = new FormControl<MedicalConditionDto | string>('');

    editors: number[] = [];
    richTextsList: string[] = [];

    editorsVisible: boolean[] = [];
    filterEditor: string = '';

    constructor(private medicalConditionService: MedicalConditionService, private allergyService: AllergyService,
        private service: MedicalRecordService, private fb: FormBuilder, private toastr: ToastrService,
        private route: ActivatedRoute, private router: Router) { }

    ngOnDestroy(): void { }

    async ngOnInit(): Promise<void> {
        this.route.params.subscribe((params) => {
            this.patientId = params['id'];
        });
        await this.getAllMedicalConditions();
    }

    createDto() {
        let medicalRecordAllergyDTOList: MedicalRecordAllergyDTO[] = [];
        for (let i = 0; i < this.allergiesIndexes.length; i++) {
            if (this.allergiesList[i] != null) {
                medicalRecordAllergyDTOList.push({
                    allergyId: this.allergiesList[i].id,
                    description: this.observationsAllergy[i],
                });
            }
        }

        let medicalRecordConditionDTOList: MedicalRecordConditionDTO[] = [];
        for (let i = 0; i < this.medicalConditionsIndexes.length; i++) {
            if (this.medicalConditionsList[i] != null) {
                medicalRecordConditionDTOList.push({
                    medicalConditionId: this.medicalConditionsList[i].id,
                    description: this.observationsMedicalCondition[i],
                });
            }
        }
        const dto = {
            patientId: this.patientId,
            allergies: medicalRecordAllergyDTOList,
            medicalConditions: medicalRecordConditionDTOList,
            freeTexts: this.richTextsList,
        };
        return dto;
    }
    async getAllMedicalConditions() {
        this.medicalConditionService.getAllMedicalCondition().subscribe({
            next: (list) => {
                this.allMedicalConditions = list;
                this.getAllAllergies();
            },
        });
    }
    async getAllAllergies() {
        this.allergyService.getAllAllergies().subscribe({
            next: async (list) => {
                this.allAllergies = list;
                await this.populateMedicalRecord();
            },
        });
    }

    async populateMedicalRecord() {
        this.service.getMedicalRecord(this.patientId).subscribe({
            next: (dto) => {
                const medicalConditionListDto = dto.medicalConditions;

                for (let i = 0; i < medicalConditionListDto.length; i++) {
                    const medicalCondition = medicalConditionListDto[i];

                    const medicalConditionsFound = this.allMedicalConditions.filter(
                        (mc) => mc.id === medicalCondition.medicalConditionId
                    );

                    if (medicalConditionsFound && medicalConditionsFound.length > 0) {
                        this.addMedicalCondition();

                        this.medicalConditionControls[i].setValue(medicalConditionsFound[0]);

                        this.medicalConditionsList.push(medicalConditionsFound[0]);
                        this.observationsMedicalCondition[i] = medicalCondition.description;
                    }
                }

                const allergiesListDto = dto.allergies;

                for (let i = 0; i < allergiesListDto.length; i++) {
                    const allergy = allergiesListDto[i];

                    const allergiesFound = this.allAllergies.filter(
                        (allergyItem) => allergyItem.id === allergy.allergyId
                    );

                    if (allergiesFound && allergiesFound.length > 0) {
                        this.addAllergy();

                        this.allergyControls[i].setValue(allergiesFound[0]);

                        this.allergiesList.push(allergiesFound[0]);
                        this.observationsAllergy[i] = allergy.description;
                    }
                }

                if (dto.freeTexts) {
                    this.richTextsList = dto.freeTexts;
                }

                if (this.richTextsList.length > 0) {
                    this.richTextsList.forEach(() => {
                        this.editors.push(this.editors.length);
                        this.editorsVisible.push(true);
                    });
                }
            },
            error: (err: HttpErrorResponse) => {
                this.toastr.error('Failed to fetch medical record: ' + err.error.message, 'Error');
            },
        });
    }

    updateMedicalRecord() {
        const dto = this.createDto();
        if (!dto) {
            this.toastr.error('Invalid dto ', 'Error');
        }
        this.service.updateMedicalRecord(dto as MedicalRecordDTO, this.patientId).subscribe({
            next: () => {
                this.toastr.success('Medical record updated successfully', 'Success');
            },
            error: (err: HttpErrorResponse) => {
                this.toastr.error('Failed to update medical record\n' + err.error.message, 'Error');
            },
        });
    }

    addNewRichtText() {
        this.editors.push(this.editors.length);
        this.editorsVisible.push(true);
        this.richTextsList.push(''); // Initialize with an empty string

        this.deactivateEditorFilter();
    }
    removeRichtText(index: number) {
        this.editors.splice(index, 1); // Remove editor from the list
        this.editorsVisible.splice(index, 1);
        this.richTextsList.splice(index, 1); // Remove corresponding content
    }

    addMedicalCondition() {
        this.medicalConditionsIndexes.push(this.medicalConditionsIndexes.length);
        this.medicalConditionsVisible.push(true);
        this.medicalConditionsList.push();
        this.observationsMedicalCondition.push();

        const newControl = new FormControl<MedicalConditionDto | string>(''); // Create a new FormControl
        this.medicalConditionControls.push(newControl);

        this.deactivateMedicalConditionFilter();
    }
    removeMedicalCondition(index: number) {
        this.medicalConditionsIndexes.splice(index, 1); // Remove editor from the list
        this.medicalConditionsVisible.splice(index, 1);
        this.medicalConditionsList.splice(index, 1); // Remove corresponding content
        this.observationsMedicalCondition.splice(index, 1);
        this.medicalConditionControls.splice(index, 1);
    }

    addAllergy() {
        this.allergiesIndexes.push(this.allergiesIndexes.length);
        this.allergiesVisible.push(true);
        this.allergiesList.push();
        this.observationsAllergy.push();

        const newControl = new FormControl<AllergyDto | string>(''); // Create a new FormControl
        this.allergyControls.push(newControl);

        this.deactivateAllergyFilter();
    }
    removeAllergy(index: number) {
        this.allergiesIndexes.splice(index, 1); // Remove editor from the list
        this.allergiesVisible.splice(index, 1);
        this.allergiesList.splice(index, 1); // Remove corresponding content
        this.observationsAllergy.splice(index, 1);
        this.allergyControls.splice(index, 1);
    }

    updateContent(newContent: string, index: number) {
        this.richTextsList[index] = newContent;
    }

    onMedicalConditionSelected(selectedCondition: MedicalConditionDto, index: number) {
        if (selectedCondition != null) {
            this.medicalConditionsList.push();
            this.medicalConditionsList.splice(index, 0, selectedCondition);
        }
    }

    onAllergySelected(selectedAllergy: AllergyDto, index: number) {
        if (selectedAllergy != null) {
            this.allergiesList[index] = selectedAllergy;
        }
    }



    deactivateAllergyFilter() {
        this.allergyFilter.setValue('');
        this.filterAllergy(undefined);
    }

    filterAllergy(selectedAllergy: AllergyDto | undefined) {
        if (selectedAllergy == undefined || selectedAllergy == null) {
            for (let i = 0; i < this.allergiesVisible.length; i++) {
                this.allergiesVisible[i] = true;
            }
        } else {
            for (let i = 0; i < this.allergiesVisible.length; i++) {
                if (this.allergiesList[i].id == selectedAllergy.id) {
                    this.allergiesVisible[i] = true;
                } else {
                    this.allergiesVisible[i] = false;
                }
            }
        }
    }

    deactivateMedicalConditionFilter() {
        this.medicalConditionFilter.setValue('');
        this.filterMedicalCondition(undefined);
    }

    filterMedicalCondition(selectedMedicalCondition: MedicalConditionDto | undefined) {
        if (selectedMedicalCondition == undefined || selectedMedicalCondition == null) {
            for (let i = 0; i < this.medicalConditionsVisible.length; i++) {
                this.medicalConditionsVisible[i] = true;
            }
        } else {
            for (let i = 0; i < this.medicalConditionsVisible.length; i++) {
                if (this.medicalConditionsList[i].id == selectedMedicalCondition.id) {
                    this.medicalConditionsVisible[i] = true;
                } else {
                    this.medicalConditionsVisible[i] = false;
                }
            }
        }
    }

    deactivateEditorFilter() {
        this.filterEditor = '';
        this.filterEditors(undefined);
    }
    filterEditors(event: any) {
        if (event == undefined || event == null) {
            for (let i = 0; i < this.editorsVisible.length; i++) {
                this.editorsVisible[i] = true;
            }
        } else {
            this.filterEditor = event.target.value;
            if (this.filterEditor == '') {
                for (let i = 0; i < this.editorsVisible.length; i++) {
                    this.editorsVisible[i] = true;
                }
            } else {
                for (let i = 0; i < this.editorsVisible.length; i++) {
                    if (this.convertHtmlToString(this.richTextsList[i]).toLowerCase().replace(/\s/g, "").includes(this.filterEditor.toLowerCase().replace(/\s/g, ""))) {
                        this.editorsVisible[i] = true;
                    } else {
                        this.editorsVisible[i] = false;
                    }
                }
            }
        }
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
