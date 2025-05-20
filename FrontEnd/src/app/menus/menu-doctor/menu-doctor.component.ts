import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { Router, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-menu-doctor',
    standalone: true,
    imports: [SidebarComponent, RouterOutlet],
    templateUrl: './menu-doctor.component.html',
    styleUrl: './menu-doctor.component.css'
})
export class MenuDoctorComponent implements OnInit {
    constructor() { }
    ngOnInit(): void { }
}
