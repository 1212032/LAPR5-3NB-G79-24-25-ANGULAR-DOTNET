import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AllergyService } from '../../services/allergy.service';
import { CreatingAllergyDto } from '../../dto/creatingAllergyDto';

@Component({
  selector: 'app-create-allergy',
  standalone: true,
  templateUrl: './create-allergy.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  styleUrl: './create-allergy.component.css',
})
export class CreateAllergyComponent implements OnInit {
  patientForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: AllergyService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  createDto(): CreatingAllergyDto {   
    let dto: CreatingAllergyDto = {
      code: this.patientForm.get('code')?.value,
      name: this.patientForm.get('name')?.value,
      description: this.patientForm.get('description')?.value,      
    };
    return dto;
  }
  findInvalidForm(): string[]{
    let errors : string[] = [];
    if(this.patientForm.controls['code'].invalid){
      errors.push("Please insert code");
    }
    if(this.patientForm.controls['name'].invalid){
      errors.push( "Please insert name");
    }
    if(this.patientForm.controls['description'].invalid){
      errors.push("Please insert description");
    }
    return errors;
  }
  createAllergy() {
    if(this.patientForm.invalid){
      this.findInvalidForm().forEach((message)=>{
        this.toastr.error(
          message,
          'Error'
        );
      })
      
      return;
    }
    let dto = this.createDto();

    if (dto != null) {
      this.service.createAllergy(dto).subscribe({
        next: () => {
          this.toastr.success(
            'Allergy created successfully',
            'Success'
          );
          this.patientForm.reset();
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error(
            'Failed to create allergy\n' + err.error.message,
            'Error'
          );
        },
      });
    }
  }
}
