import { Directive, HostListener, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ModalContainerComponent } from '../components/modal-container/modal-container.component';
import { HyperCookieService } from 'lib-services';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[authenticate]',
})
export class ActionAuthenticatedDirective {

    private cookieVal: any = {};
    @Output('authenticate') authenticate: EventEmitter<any> = new EventEmitter();

    constructor(
        private _hyperCookieService: HyperCookieService,
        public _matDialog: MatDialog
    ) { }

    @HostListener('click', ['$event']) onClick(event) {
        this.eventClick(event);
    }

    eventClick(event?) {
        let dialogRefLogin;
        const existEvent = event !== null && event !== undefined;

        if (existEvent) {
            this.cookieVal = this._hyperCookieService.getCookie_AUTH();
        } else {
            this.cookieVal = null;
        }


        if (this.cookieVal !== undefined && this.cookieVal !== null && this.cookieVal !== {}) {
            if (existEvent) {
                this.authenticate.emit(event);
            }
        } else {
            if (existEvent) {
                event.preventDefault();
                event.stopPropagation();
            }

            this._matDialog.closeAll();

            dialogRefLogin = this._matDialog.open(ModalContainerComponent, {
                id: 'loginAuthenticate',
                width: '445px',
                minHeight: '475px',
                panelClass: 'globalModalHJ',
                data: { component: 'login' }
            });
            dialogRefLogin.afterClosed().subscribe(result => {
                console.log(result);
                console.log('event');
                console.log(event);
                if (result !== undefined) {
                    if (event !== null && event !== undefined) {
                        this.authenticate.emit(event);
                    }
                }
            });
        }
    }
}