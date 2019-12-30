import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-admin-back-office-payment-requests',
  templateUrl: './payment-requests.component.html',
  styleUrls: ['./payment-requests.component.less']
})
export class PaymentRequestsComponent implements OnInit {

  data: any[];
  cols = [];
  constructor(private _sharedService: SharedService) { }

  ngOnInit() {
    // findPaymentRequest();
    this.data = [
      {
        id: '1',
        userName: 'thiago-avila',
        name: 'Thiago Avila',
        email: 'th@hyper.jobs',
        cellphone: '(35)99999999',
        date: Date.now(),
        value: '1000',
        method: '-',
        status: '-'
      },
      {
        id: '2',
        userName: 'guilherme-gomes',
        name: 'Guilherme Gomes',
        email: 'gu@hyper.jobs',
        cellphone: '(35)99998888',
        date: Date.now(),
        value: '2000',
        method: '-',
        status: '-'
      }
    ];
    Object.keys(this.data[0]).forEach(element => {
      this.cols.push({ field: element, header: _.upperFirst(element) });
    });
  }

  findPaymentRequest() {
    this._sharedService.findPaymentRequests().subscribe(
      (response: any) => {
        this.cols = [];
        if (response.length > 0) {
          this.data = response;
          Object.keys(this.data[0]).forEach(element => {
            this.cols.push({ field: element, header: _.upperFirst(element) });
          });
        }
      },
      err => {
        console.log(err);
      }
    );
  }
}
