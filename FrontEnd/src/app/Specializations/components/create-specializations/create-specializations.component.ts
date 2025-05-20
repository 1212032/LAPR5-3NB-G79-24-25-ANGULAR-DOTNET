import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpecializationService } from '../../services/specializations.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CreatingSpecializationsDto } from '../../dto/creatingSpecializationsDto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-specializations',
  standalone: true,
  templateUrl: './create-specializations.component.html',
  styleUrls: ['./create-specializations.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class CreateSpecializationsComponent {
  createForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private specializationService: SpecializationService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.createForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  createSpecialization() {
    if (this.createForm.invalid) {
      this.toastr.warning('Please fill out the form correctly.', 'Warning');
      this.createForm.markAllAsTouched();
      return;
    }
  
    const dto: CreatingSpecializationsDto = this.createForm.value;
    this.specializationService.createSpecialization(dto).subscribe({
      next: () => {
        this.toastr.success('Specialization created successfully!', 'Success');
        this.router.navigate(['/admin/specialization/search']);
      },
      error: (err) => {
        this.toastr.error('Error creating specialization:\n' + err.message, 'Error');
      },
    });
  }
}
