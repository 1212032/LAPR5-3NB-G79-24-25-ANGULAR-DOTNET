import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { SurgeryRoomService } from '../../services/surgeryRoom.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { SurgeryRoomDto } from '../../dto/surgeryRoomDto';

@Component({
    selector: 'app-create-surgery-room',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './create-surgery-room.component.html',
    styleUrl: './create-surgery-room.component.css'
})
export class CreateSurgeryRoomComponent implements OnInit {
    roomForm!: FormGroup;
    room?: SurgeryRoomDto;

    constructor(private fb: FormBuilder, private service: SurgeryRoomService, private toastr: ToastrService) { }

    ngOnInit(): void {
        this.roomForm = this.fb.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            description: ['', Validators.required],
            forSurgery: [true, Validators.required]
        })
    }

    createDto() {
        const surgeryRoomDto = {
            code: this.roomForm.value.code,
            name: this.roomForm.value.name,
            description: this.roomForm.value.description,
            forSurgery: this.roomForm.value.forSurgery
        }
        return surgeryRoomDto;
    }

    createSurgeryRoom() {
        this.room = this.createDto();

        if (this.room == null)
            return alert("Room invalid, unexpected error!");

        this.service.createSurgeryRoom(this.room).subscribe({
            next: () => {
                this.toastr.success('Room created successfully', 'Success');
                this.roomForm.reset();
            },
            error: (err: HttpErrorResponse) => {
                this.toastr.error('Failed to create room: ' + err.error.message, 'Error');
            }
        })
    }
}
