import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-back-office-request-financing',
  templateUrl: './request-financing.component.html',
  styleUrls: ['./request-financing.component.less']
})
export class RequestFinancingComponent implements OnInit {

  public data: any;
  public valueMin = 0;
  public parcels = [];
  public plots = [];
  public parcelsMax = 4;
  public nrPlots = 4;
  public maskMoney = { prefix: 'R$ ', thousands: '.', decimal: ',' };
  public request = true;
  public valueFinancing = 0;

  public plotsObj = [];
  // public percentages = [0.03, 0.06, 0.09, 0.12, 0.15, 0.18];
  //  public percentages_ = [
  //   [1.0350],
  //   [0.525, 0.555],
  //   [0.363, 0.375, 0.389],
  //   [0.279, 0.289, 0.299, 0.303],
  //   [0.224, 0.234, 0.244, 0.259, 0.274],
  //   [0.184, 0.189, 0.196, 0.210, 0.215, 0.229]
  // ];
  //public tax = [25.9, 5.9, 5.9, 5.9, 5.9, 5.9];

  public percentages_ = [
    [1.0703],
    [0.5656, 0.566],
    [0.378, 0.378, 0.378],
    [0.295, 0.295, 0.295, 0.295]
  ];
  public tax_ = 0;

  constructor(
    public dialogRef: MatDialogRef<RequestFinancingComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.data = _data;
    this.valueMin = this.data.valueMin;
    this.valueFinancing = this.data.price - this.valueMin;
    this.changeValueMin();
  }

  ngOnInit() {
    this.parcels = [
      { label: '1x', value: 1 },
      { label: '2x', value: 2 },
      { label: '3x', value: 3 },
      { label: '4x', value: 4 }
      //,
      // { label: '5x', value: 5 },
      // { label: '6x', value: 6 }
    ];
  }

  changeValueMin() {
    if (this.valueMin < this.data.valueMin) {
      this.valueMin = this.data.valueMin;
    }

    if (this.valueMin >= this.data.price) {
      this.valueMin = this.data.price;
    }

    this.valueFinancing = this.data.price - this.valueMin;

    this.mountPlots();
  }

  private calcTaxa(value, parcels, taxaFixa) {
    const taxa = 3 / 100;
    const fator = (taxa / (1 - (1 / Math.pow(1 + taxa, parcels))));

    return (value * fator + taxaFixa).toFixed(2);
  }

  changePlots(value) {
    this.nrPlots = value;
    this.mountPlots();
  }

  mountPlots() {
    this.plotsObj = [];
    const valuePlot = (this.data.price - this.valueMin) / this.nrPlots;
    const valueRest = this.data.price - this.valueMin;

    for (let i = 0; i < this.nrPlots; i++) {
      const date = new Date();

      //const value = valuePlot + (valuePlot * this.percentages[i]) + this.tax[i];
      const value = valueRest * this.percentages_[this.nrPlots - 1][i] + this.tax_;

      this.plotsObj.push({
        plot: i + 1,
        paymentDate: this.getDateFormat(this.addDays(date, 30 * (i + 1))),
        value: value.toFixed(2)
      });
    }
  }

  closeModal() {
    let value_financing = 0;
    this.plotsObj.forEach(element => {
      value_financing += parseFloat(element.value);
    });

    const obj = {
      value_init: this.valueMin,
      value_financing: this.data.price - this.valueMin,
      plots: this.nrPlots,
      plotsObj: JSON.stringify(this.plotsObj)
    };

    this.dialogRef.close(obj);
  }

  private addDays(startDate, numberOfDays) {
    return new Date(startDate.getTime() + (numberOfDays * 24 * 60 * 60 * 1000));
  }

  private getDateFormat(date): string {
    let day = date.getDate();
    let month = (date.getMonth() + 1);
    const year = date.getFullYear();

    day = day > 9 ? day : '0' + day;
    month = month > 9 ? month : '0' + month;

    return day + '/' + month + '/' + year;
  }
}
