import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/timer';
import { Subscription } from 'rxjs/Subscription';

import { BroadcastEventService } from 'lib-services';


@Injectable()
export class MyInterceptor implements HttpInterceptor {

    private count = 0;
    private timer: Observable<any>;
    private timerSubscribe = new Subscription;

    constructor() {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //const cloneReq = req.clone({ headers: req.headers.set('Content-Type', 'application/x-www-form-urlencoded') });

        this.count++;

        if (this.count === 1) {
            BroadcastEventService.event('eventSpinner').emit(true);
            this.limitTimer(30);
        }

        //return next.handle(cloneReq)
        return next.handle(req)
            .do(evt => {
                if (evt instanceof HttpResponse) {
                }
            })
            .catch((err: any) => {
                return Observable.throw(err);
            }).finally(() => {
                this.count--;
                if (this.count === 0) {
                    BroadcastEventService.event('eventSpinner').emit(false);
                    this.timerSubscribe.unsubscribe();
                }
            });

    }

    limitTimer(limit) {
        this.timerSubscribe.unsubscribe();

        this.timer = Observable.timer(2000, 1000);
        this.timerSubscribe = this.timer.subscribe(
            tick => {
                if (tick >= limit) {
                    BroadcastEventService.event('eventSpinner').emit(false);
                    this.timerSubscribe.unsubscribe();
                }
            }
        );
    }
}