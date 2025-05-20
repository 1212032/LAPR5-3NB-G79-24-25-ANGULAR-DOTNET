import { Inject, inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class TokenDecodeService {
    routes = inject(Router);

    localStorage;

    //check if localStorage is available to ignore ERROR ReferenceError: document is not defined
    isLocalStorageAvailable = typeof localStorage !== 'undefined';

    constructor(@Inject(DOCUMENT) private document: Document) {
        this.localStorage = document.defaultView?.localStorage;

    }

    isLoggedIn(): boolean {
        if (this.localStorage == null) {
            return false;
        }
        let token = this.localStorage.getItem('token');
        if (token == null) {
            return false;
        }
        return true;
    }


    getToken(): string {
        if (this.localStorage == null) {
            return '';
        }
        let token = this.localStorage.getItem('token');
        if (token != null)
            return token;

        return '';
    }
    getUserEmail(): string {
        if (this.localStorage == null) {
            return '';
        }
        let token = this.localStorage.getItem('token');

        if (token != null) {
            let decodedJWT = JSON.parse(window.atob(token.split('.')[1]));
            return decodedJWT.email;//.toLowerCase();
        }
        return '';
    }

    getUserRole(): string {
        if (this.localStorage == null) {
            return '';
        }
        let token = this.localStorage.getItem('token');
        if (token != null) {
            let decodedJWT = JSON.parse(window.atob(token.split('.')[1]));
            try {
                return decodedJWT.roles[0];//.toLowerCase();
            } catch (ex) {
                return '';
            }
        }
        return '';
    }
}
