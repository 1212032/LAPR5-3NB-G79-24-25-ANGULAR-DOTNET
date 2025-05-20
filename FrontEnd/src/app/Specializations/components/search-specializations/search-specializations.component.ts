import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SpecializationService } from '../../services/specializations.service';
import { SpecializationsDto } from '../../dto/specializationsDto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-specializations',
  standalone: true,
  templateUrl: './search-specializations.component.html',
  styleUrls: ['./search-specializations.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class SearchSpecializationsComponent {
  searchForm: FormGroup;
  specializations: SpecializationsDto[] = [];
  sortedSpecializations: SpecializationsDto[] = [];

  constructor(
    private fb: FormBuilder,
    private specializationService: SpecializationService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.searchForm = this.fb.group({
      name: [''],
      code: [''],
      description: [''],
    });
  }

  searchSpecializations(): void {
    const formValues = this.searchForm.value;

    // Caso nenhum filtro seja preenchido, busca todas as especializações
    if (!formValues.code && !formValues.name && !formValues.description) {
      this.specializationService.getAllSpecializations().subscribe({
        next: (data: SpecializationsDto[]) => {
          this.specializations = data;
          this.sortedSpecializations = [...this.specializations];
          if (this.specializations.length === 0) {
            this.toastr.success('No specializations available.', 'Success');
          } else {
            this.toastr.success('All specializations loaded successfully.', 'Success');
          }
        },
        error: (err) => {
          this.toastr.error('Something went wrong while fetching data. Please try again.', 'Error');
        },
      });
      return;
    }

    // Construção dos parâmetros de consulta
    const queryParams: { code?: string; name?: string; description?: string } = {};
    if (formValues.code) {
      queryParams.code = formValues.code;
    }
    if (formValues.name) {
      queryParams.name = formValues.name;
    }
    if (formValues.description) {
      queryParams.description = formValues.description;
    }

    // Busca filtrada
    this.specializationService.searchSpecializations(queryParams).subscribe({
      next: (data: SpecializationsDto[]) => {
        this.specializations = data;
        this.sortedSpecializations = [...this.specializations];
        if (this.specializations.length === 0) {
          this.toastr.success('No specializations found.', 'Success');
        } else {
          this.toastr.success('Search completed successfully.', 'Success');
        }
      },
      error: (err) => {
        this.toastr.error('Error fetching search results. Please try again.', 'Error');
      },
    });
  }

  editSpecialization(specialization: SpecializationsDto): void {
    this.router.navigate(['/admin/specialization/update', specialization.id]);
  }

  deleteSpecialization(specialization: SpecializationsDto): void {
    if (confirm(`Are you sure you want to delete specialization "${specialization.name}"?`)) {
      this.specializationService.deleteSpecialization(specialization.id).subscribe({
        next: () => {
          this.specializations = this.specializations.filter((s) => s.id !== specialization.id);
          this.sortedSpecializations = [...this.specializations];
          this.toastr.success('Specialization deleted successfully', 'Success');
        },
        error: (err) => {
          this.toastr.error('Failed to delete specialization. Please try again.', 'Error');
        },
      });
    }
  }
}
