import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
    constructor(private authService: MsalService) {

    }

    async logout(popup?: boolean) {
        await this.authService.instance.initialize();
        this.authService.instance.handleRedirectPromise().then((response) => {
            this.authService.logoutRedirect();
        });
    }
}
