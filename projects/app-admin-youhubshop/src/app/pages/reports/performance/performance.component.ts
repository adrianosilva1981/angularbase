import { Component, OnInit } from '@angular/core';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-admin-youhubshop/services/shared.service';

@Component({
    selector: 'app-admin-youhubshop-performance',
    templateUrl: './performance.component.html',
    styleUrls: ['./performance.component.less']
})
export class PerformanceComponent implements OnInit {

    performance: any;

    dates: Date[] = [new Date(Date.now() - (10 * 24 * 60 * 60 * 1000)), new Date()];

    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
    ) {
        this.setPerformance();
    }

    ngOnInit() {
    }

    setPerformance() {
        if (!(this.dates[0] && this.dates[1])) {
            return;
        }
        const data = {
            startDate: this.dates[0].toJSON().split('T')[0],
            endDate: this.dates[1].toJSON().split('T')[0],
        };
        this._sharedService.getPerformance(data).subscribe(
            response => {
                if (response.return) {
                    this.performance = response.data;
                    this.performance.points = Math.trunc(this.performance.points);
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', 'Entre em contato com o Suporte!');
                    console.log(response);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Error', 'Entre em contato com o Suporte!');
                console.log(err);
            }
        );
    }
}
