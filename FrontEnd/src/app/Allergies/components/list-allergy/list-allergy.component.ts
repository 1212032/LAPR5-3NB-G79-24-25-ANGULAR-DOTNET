import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AllergyService } from '../../services/allergy.service';
import { AllergyDto } from '../../dto/allergyDto';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-list-allergy',
  templateUrl: './list-allergy.component.html',
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
  styleUrl: './list-allergy.component.css',
})
export class ListAllergyComponent implements OnInit {
  @Output() allergiesEmmiter = new EventEmitter<AllergyDto[]>();
  @Output() selectedAllergy = new EventEmitter<AllergyDto>();
  @Input() myControl = new FormControl<string | AllergyDto>('');
  
  allergies!: AllergyDto[];
  
  filteredAllergy!: Observable<AllergyDto[]>;

  constructor(private service: AllergyService, private toastr: ToastrService) {}

  async ngOnInit(): Promise<void> {
    await this.getAllAllergies();
    
  }

  private _filter(value: string | AllergyDto): AllergyDto[] {
    if (!value) {
      return this.allergies;
    }
    let filterValue;
    if (typeof value === 'string') {
      filterValue = value.toUpperCase();
    } else {
      filterValue = value.name.toUpperCase();
    }

    let filterResult = this.allergies.filter(
      (option) =>
        option.name.toUpperCase().includes(filterValue) ||
        option.code.toUpperCase().includes(filterValue)
    );
    return filterResult;
  }

  async getAllAllergies() {
    this.service.getAllAllergies().subscribe({
      next: (resultAllergies) => {
        if (resultAllergies != null) {
          this.allergies = resultAllergies;

          this.filteredAllergy = this.myControl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value || ''))
          );
          this.allergiesEmmiter.emit(this.allergies);
        } else {
          this.toastr.error('Failed to fetch allergies', 'Error');
        }
      },
      error: (error) => {
        this.toastr.error('Failed to fetch allergies', 'Error');
      },
    });
  }
  displayFn(allergy: AllergyDto): string {
    return allergy && allergy.name ? allergy.name : '';
  }
  onOptionSelected(selected: AllergyDto) {
    this.selectedAllergy.emit(selected);
  }
}
