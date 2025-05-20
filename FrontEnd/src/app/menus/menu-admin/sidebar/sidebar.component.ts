import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [RouterLink, CommonModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
    activeMenu: string | null = null;

    constructor(private authService: MsalService) { }

    toggleSubMenu(menu: string) {
        this.activeMenu = this.activeMenu === menu ? null : menu;
    }

    async logout(popup?: boolean) {
        await this.authService.instance.initialize();
        this.authService.instance.handleRedirectPromise().then((response) => {
            this.authService.logoutRedirect();
        });
    }
}

