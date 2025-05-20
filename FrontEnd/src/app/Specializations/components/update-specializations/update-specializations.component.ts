import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SpecializationService } from '../../services/specializations.service';
import { SpecializationsDto } from '../../dto/specializationsDto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-specializations',
  standalone: true,
  templateUrl: './update-specializations.component.html',
  styleUrls: ['./update-specializations.component.css'],
  imports: [ReactiveFormsModule,CommonModule],
})
export class UpdateSpecializationsComponent implements OnInit {
  updateForm: FormGroup;
  specializationId: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private specializationService: SpecializationService,
    private toastr: ToastrService
  ) {
    this.specializationId = +this.route.snapshot.params['id'];
  
    if (isNaN(this.specializationId) || this.specializationId <= 0) {
      this.toastr.error('Invalid Specialization ID', 'Error');
      this.router.navigate(['/admin/specialization/search']);
    }
  
    this.updateForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  ngOnInit(): void {
    this.loadSpecialization();
  }

  loadSpecialization() {
    this.specializationService.getSpecializationById(this.specializationId).subscribe({
      next: (data: SpecializationsDto) => {
        this.updateForm.patchValue(data);
      },
      error: (err) => {
        this.toastr.error('Error loading specialization details:\n' + err.message, 'Error');
        this.router.navigate(['/admin/specialization/search']);
      },
    });
  }

  updateSpecialization(): void {
    if (this.updateForm.valid) {
      const updatedSpecialization: SpecializationsDto = { ...this.updateForm.value, id: this.specializationId };

      this.specializationService.updateSpecialization(this.specializationId, updatedSpecialization).subscribe({
        next: () => {
          this.toastr.success('Specialization updated successfully!', 'Success');
          this.router.navigate(['/admin/specialization/search']);
        },
        error: (err) => {
          this.toastr.error('Error updating specialization:\n' + err.error.message, 'Error');
        },
      });
    } else {
      this.updateForm.markAllAsTouched();
      this.toastr.error('Please fill out all required fields.', 'Error');
    }
  }
}
