import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AllergyService } from '../../services/allergy.service';
import { AllergyDto } from '../../dto/allergyDto';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-update-allergy',
    standalone: true,
    templateUrl: './update-allergy.component.html',
    imports: [ReactiveFormsModule, CommonModule],
    styleUrl: './update-allergy.component.css',
})
export class UpdateAllergyComponent implements OnInit {
    allergyForm!: FormGroup;
    allergyId: string;

    constructor(private fb: FormBuilder, private service: AllergyService, private toastr: ToastrService,
        private route: ActivatedRoute, private router: Router) {
        this.allergyId = '';
    }

    ngOnInit(): void {
        this.allergyForm = this.fb.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            description: ['', Validators.required],
        });
        this.route.params.subscribe(params => {
            this.allergyId = params['id'];
            this.getAllergy();
        });
    }

    getAllergy() {
        this.service.getAllergyById(this.allergyId).subscribe({
            next: (resultAllergy: AllergyDto | null) => {
                if (resultAllergy != null) {
                    this.allergyForm.controls['code'].setValue(resultAllergy.code);
                    this.allergyForm.controls['name'].setValue(resultAllergy.name);
                    this.allergyForm.controls['description'].setValue(resultAllergy.description);
                } else {
                    this.toastr.error('Allergy not found', 'Error');
                    this.sendToSearch();
                }
            },
            error: (err: HttpErrorResponse) => {
                this.toastr.error('Allergy not found', 'Error');
                this.sendToSearch();
            }
        });
    }

    createDto(): AllergyDto {
        let dto: AllergyDto = {
            id: this.allergyId,
            code: this.allergyForm.get('code')?.value,
            name: this.allergyForm.get('name')?.value,
            description: this.allergyForm.get('description')?.value,
        };
        return dto;
    }

    findInvalidForm(): string[] {
        let errors: string[] = [];
        if (this.allergyForm.controls['code'].invalid) {
            errors.push("Please insert code");
        }
        if (this.allergyForm.controls['name'].invalid) {
            errors.push("Please insert name");
        }
        if (this.allergyForm.controls['description'].invalid) {
            errors.push("Please insert description");
        }
        return errors;
    }

    updateAllergy() {
        if (this.allergyForm.invalid) {
            this.findInvalidForm().forEach((message) => {
                this.toastr.error(message, 'Error');
            })
            return;
        }
        let dto = this.createDto();

        if (dto != null) {
            this.service.updateAllergy(dto).subscribe({
                next: () => {
                    this.toastr.success('Allergy updated successfully', 'Success');
                    this.sendToSearch();
                },
                error: (err: HttpErrorResponse) => {
                    this.toastr.error('Failed to update allergy\n' + err.error.message, 'Error');
                },
            });
        }
    }

    private sendToSearch() {
        this.router.navigate(['/admin/allergy/search']);
    }
}
