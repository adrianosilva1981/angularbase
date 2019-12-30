import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-hyper-store/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-hyper-store-buy-city',
  templateUrl: './buy-city.component.html',
  styleUrls: ['./buy-city.component.less']
})
export class BuyCityComponent implements OnInit {

  public states = [];
  public cities = [];
  public shops = [];
  public showCity = false;
  public loading = false;
  public showFormContact = false;

  private stateSelected = 0;
  private citySelected = 0;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) { }

  ngOnInit() {
    this._sharedService.getStatesFromCoutryIso().subscribe(
      (response: any) => {
        if (response.return) {
          this.states = response.data;
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', err);
      }
    );
  }

  onSelectState(id) {
    this.citySelected = 0;
    this.cities = [];
    if (id != undefined) {
      this.stateSelected = id;
      this._sharedService.getCitiesFromStateName(id).subscribe(
        (response: any) => {
          if (response.return) {
            this.cities = response.data;
          } else {
            this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          }
        },
        err => {
          this._hyperToastsService.addToast('error', 'Erro', err);
        }
      );
    }
  }

  onSelectedCity(id) {
    this.citySelected = id;
  }

  onSearch() {
    if (this.stateSelected > 0) {
      this.loading = true;

      this._sharedService.listShops(this.stateSelected, this.citySelected).subscribe(
        (response: any) => {
          this.showCity = this.citySelected > 0 ? false : true;

          if (response.return) {
            this.shops = response.data;
            this.showFormContact = false;
          } else {
            this.shops = [];
            this.showFormContact = true;
          }

          this.loading = false;
        },
        err => {
          this._hyperToastsService.addToast('error', 'Erro', err);
          this.loading = false;
        }
      );
    }
  }
}
