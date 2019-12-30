import { HyperToastsService } from 'lib-services';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import * as _ from 'lodash';


@Component({
  selector: 'app-admin-back-office-associate-state',
  templateUrl: './associate-state.component.html',
  styleUrls: ['./associate-state.component.less']
})
export class AssociateStateComponent implements OnInit {
  public states = require('global/data/states-brazil.json');
  public associates: any[] = [];
  public cols: any[] = [];
  public cities: any[] = [];
  public selectedCities: any[] = [];
  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) {
    this._hyperToastsService.addToast('warn', 'Atenção', 'Escolha um estado!');
  }

  ngOnInit() {
  }

  setAssociates() {
    const data = {
      cities: this.selectedCities
    };
    this.associates = [];
    this.cols = [];
    this._sharedService.getAssociateByCities(data).subscribe(
      response => {
        if (response.return) {
          response.data.forEach(associate => {
            associate.manager = JSON.parse(associate.manager);
            associate.director = JSON.parse(associate.director);
            this.associates.push({
              username: associate.username,
              name: associate.name,
              username_manager: associate.manager.username,
              name_manager: associate.manager.name,
              username_director: associate.director.username,
              name_director: associate.director.name,
              city: associate.city,
              cell: associate.cell
            });
          });
          Object.keys(this.associates[0]).forEach((col: string) => {
            this.setCols(col);
          });
        }
      },
      err => {

      }
    );
  }

  setCols(col: string) {
    switch (col) {
      case 'username':
        this.cols.push({
          field: col,
          header: 'Código'
        });
        break;
      case 'name':
        this.cols.push({
          field: col,
          header: 'Nome'
        });
        break;
      case 'username_manager':
        this.cols.push({
          field: col,
          header: 'Código Gerente'
        });
        break;
      case 'name_manager':
        this.cols.push({
          field: col,
          header: 'Nome Gerente'
        });
        break;
      case 'username_director':
        this.cols.push({
          field: col,
          header: 'Código Diretor'
        });
        break;
      case 'name_director':
        this.cols.push({
          field: col,
          header: 'Nome Diretor'
        });
        break;
      case 'city':
        this.cols.push({
          field: col,
          header: 'Cidade'
        });
        break;
      case 'cell':
        this.cols.push({
          field: col,
          header: 'Célula'
        });
        break;
      default:
        this.cols.push({
          field: col,
          header: _.upperFirst(col).replace(new RegExp('_'), ' ')
        });
        break;
    }
  }

  getCities(value) {
    this.cities = [];
    this._sharedService.getCitiesByState(value).subscribe(
      response => {
        if (response.return) {
          response.data.forEach(city => {
            this.cities.push({
              label: _.upperFirst(city.city),
              value: city.city
            });
          });
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          this.cities = [];
          this.selectedCities = [];
          this.associates = [];
          this.cols = [];
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Error', 'Aconteceu algum problema, entre em contato com o suporte!');
        console.error(err);
      }
    );
  }

}
