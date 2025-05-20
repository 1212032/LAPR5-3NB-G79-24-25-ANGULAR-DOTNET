import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterLink, LogInComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'Hospital Manager';
}

