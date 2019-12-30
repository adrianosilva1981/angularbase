import { HyperToastsService } from 'lib-services';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '@app-admin-back-office/services/shared.service';

@Component({
  selector: 'app-admin-back-office-percentage',
  templateUrl: './percentage.component.html',
  styleUrls: ['./percentage.component.less']
})
export class PercentageComponent implements OnInit {

  data: any;
  points: number;
  value_final: number;
  value_start: number;
  porcentage: number;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _route: Router
  ) {
    this.setData();
  }

  ngOnInit() {
  }

  setData() {
    this.data = [];
    this.points = 0;
    this.value_final = 0;
    this.value_start = 0;
    this.porcentage = 0;
    this._sharedService.getBillingCommissions().subscribe(
      response => {
        if (response.return) {
          this.points = response.data.points;
          this.value_final = response.data.value_final;
          this.value_start = response.data.value_start;

          this.porcentage = (((this.points) / (this.value_final)) * 100);
          const colors = [this.getRandomColor(), this.getRandomColor()];
          this.data = {
            labels: [this.porcentage.toFixed(2).toString().concat('%'), (100 - this.porcentage).toFixed(2).toString().concat('%')],
            datasets: [
              {
                data: [this.porcentage.toFixed(2), (100 - this.porcentage).toFixed(2)],
                backgroundColor: colors,
                hoverBackgroundColor: colors,
              }],
          };
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          this._route.navigate(['/dash']);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', err.msg);
      });
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

}
