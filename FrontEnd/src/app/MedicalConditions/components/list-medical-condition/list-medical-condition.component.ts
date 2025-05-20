import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MedicalConditionService } from '../../services/medical-condition.service';
import { MedicalConditionDto } from '../../dto/medicalConditionDto';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-list-medical-condition',
  templateUrl: './list-medical-condition.component.html',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  styleUrl: './list-medical-condition.component.css',
})
export class ListMedicalConditionComponent implements OnInit {
   @Output() medicalConditionsEmmiter = new EventEmitter<
    MedicalConditionDto[]
  >();
  @Output() selectedCondition = new EventEmitter<MedicalConditionDto>();
  @Input() myControl = new FormControl<string | MedicalConditionDto>('');
  medicalConditions!: MedicalConditionDto[];

  filteredMedicalCondition!: Observable<MedicalConditionDto[]>;

  constructor(
    private service: MedicalConditionService,
    private toastr: ToastrService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getAllMedicalCondition();
  }

  private _filter(value: string | MedicalConditionDto): MedicalConditionDto[] {
    if (!value) {
      return this.medicalConditions;
    }
    let filterValue;
    if (typeof value === 'string') {
      filterValue = value.toUpperCase();
    } else {
      filterValue = value.name.toUpperCase();
    }

    let filterResult = this.medicalConditions.filter(
      (option) =>
        option.name.toUpperCase().includes(filterValue) ||
        option.code.toUpperCase().includes(filterValue)
    );
    return filterResult;
  }

  async getAllMedicalCondition() {
    this.service.getAllMedicalCondition().subscribe({
      next: (resultMedicalConditions) => {
        if (resultMedicalConditions != null) {
          this.medicalConditions = resultMedicalConditions;

          this.filteredMedicalCondition = this.myControl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value || ''))
          );
          this.medicalConditionsEmmiter.emit(this.medicalConditions);
        } else {
          this.toastr.error('Failed to fetch medical conditions', 'Error');
        }
      },
      error: (error) => {
        this.toastr.error('Failed to fetch medical conditions', 'Error');
      },
    });
  }
  displayFn(condition: MedicalConditionDto): string {
    return condition && condition.name ? condition.name : '';
  }
  onOptionSelected(selected: MedicalConditionDto) {
    this.selectedCondition.emit(selected); // Emit selected condition
  }
}
