import { Component, OnInit, Inject, Injectable, OnDestroy } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MsalService, MsalModule, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus, PopupRequest, RedirectRequest, EventMessage, EventType, PublicClientApplication } from '@azure/msal-browser';
import { filter, Subject, takeUntil } from 'rxjs';
import { TokenDecodeService } from '../Shared/services/token-decode.service';

@Injectable()
@Component({
    selector: 'app-log-in',
    standalone: true,
    imports: [CommonModule, MsalModule, RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatMenuModule],
    templateUrl: './log-in.component.html',
    styleUrl: './log-in.component.css',
})
export class LogInComponent implements OnInit, OnDestroy {
    isIframe = false;
    loginDisplay = false;
    private readonly _destroying$ = new Subject<void>();
    localStorage1;

    constructor(
        private authService: MsalService,
        private msalBroadcastService: MsalBroadcastService,
        private tokenDecodeService: TokenDecodeService,
        private router: Router,
        @Inject(DOCUMENT) private document: Document
    ) {
        this.localStorage1 = document.defaultView?.localStorage;
        //this.localStorage1?.removeItem('token');
    }

    ngOnInit(): void {
        this.authService.handleRedirectObservable().subscribe();
        //this.isIframe = window !== window.parent && !window.opener; // Remove this line to use Angular Universal

        this.setLoginDisplay();

        this.authService.instance.enableAccountStorageEvents(); // Optional - This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED events emitted when a user logs in or out of another tab or window
        this.msalBroadcastService.msalSubject$
            .pipe(
                filter(
                    (msg: EventMessage) =>
                        msg.eventType === EventType.ACCOUNT_ADDED ||
                        msg.eventType === EventType.ACCOUNT_REMOVED
                )
            )
            .subscribe((result: EventMessage) => {
                if (this.authService.instance.getAllAccounts().length === 0) {
                    window.location.pathname = '/';
                } else {
                    this.setLoginDisplay();
                }
            });

        this.msalBroadcastService.inProgress$
            .pipe(
                filter(
                    (status: InteractionStatus) => status === InteractionStatus.None
                ),
                takeUntil(this._destroying$)
            )
            .subscribe(() => {
                this.setLoginDisplay();
                this.checkAndSetActiveAccount();
            });
    }

    ngOnDestroy(): void {
        this._destroying$.next(undefined);
        this._destroying$.complete();
    }

    setLoginDisplay() {
        this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    }

    checkAndSetActiveAccount() {
        /**
         * If no active account set but there are accounts signed in, sets first account to active account
         * To use active account set here, subscribe to inProgress$ first in your component
         * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
         */
        let activeAccount = this.authService.instance.getActiveAccount();

        if (
            !activeAccount &&
            this.authService.instance.getAllAccounts().length > 0
        ) {
            let accounts = this.authService.instance.getAllAccounts();
            this.authService.instance.setActiveAccount(accounts[0]);
        }
    }

    loginRedirect() {
        this.authService.loginRedirect();
    }

    loginPopup() {
        this.authService
            .loginPopup()
            .subscribe((response: AuthenticationResult) => {
                this.authService.instance.setActiveAccount(response.account);
                if (this.localStorage1) {
                    this.localStorage1.setItem('token', response.idToken);
                    if (this.tokenDecodeService != null) {
                        let role = this.tokenDecodeService.getUserRole();
                        if (role == null || role == '') {
                            role = 'patient';
                        } else {
                            role = role.toLowerCase();
                        }
                        this.router.navigate(['/' + role]);
                    }
                } else {
                    alert('Local storage not available');
                }
            });
    }

    async logout(popup?: boolean) {
        await this.authService.instance.initialize();
        this.authService.instance.handleRedirectPromise().then((response) => {
            this.authService.logoutRedirect();
        });
    }
}