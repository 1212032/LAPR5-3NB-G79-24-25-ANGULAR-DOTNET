import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../menu-admin/sidebar/sidebar.component';

@Component({
  selector: 'app-menu-admin',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './menu-admin.component.html',
  styleUrl: './menu-admin.component.css'
})
export class MenuAdminComponent {
  constructor() { }
}
