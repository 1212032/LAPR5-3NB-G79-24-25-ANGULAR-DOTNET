import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { Router, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-menu-patient',
    standalone: true,
    imports: [SidebarComponent, RouterOutlet],
    templateUrl: './menu-patient.component.html',
    styleUrl: './menu-patient.component.css'
})
export class MenuPatientComponent implements OnInit {
    constructor() { }

    ngOnInit(): void { }
}
