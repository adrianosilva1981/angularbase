import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { HyperToastsService } from 'projects/lib-services/src/lib/services/hyper-toasts.service';
import { SharedService } from '@app-admin-back-office/services/shared.service';

import * as _ from 'lodash';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-admin-back-office-pack-sold',
  templateUrl: './pack-sold.component.html',
  styleUrls: ['./pack-sold.component.less']
})
export class PackSoldComponent implements OnInit {

  users = [];
  cols = [];
  business: SelectItem[];
  selected: any;
  data: any;
  type = 'pie';
  listStatus = this._shareService.listEnumStatus();
  total = 0;

  constructor(
    private _shareService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute, ) {

    this.business = [
      {
        label: 'Todos',
        value: 'Todos',
        title: '',
      },
      {
        label: 'EditoraCria',
        value: 'EditoraCria',
        title: 'Pack de Livros Infantis',
      },
      {
        label: 'Maskoto',
        value: 'Maskoto',
        title: 'Pack de Produtos Pet Shop',
      },
      {
        label: 'YouHub',
        value: 'YouHub',
        title: 'Ingresso para CONVENÇÃO',
      }
    ];
    this.selected = this.business[0].value;

  }

  ngOnInit() {
    const data = {
      business: this.selected,
    };
    let filter: SelectItem;
    this.business.forEach((element: SelectItem) => {
      if (element.value === this.selected) {
        filter = element;
      }
    });
    this.changeSelected();
  }

  changeSelected() {
    const data = {
      business: this.selected,
    };
    let filter: SelectItem;
    this.business.forEach((element: SelectItem) => {
      if (element.value === this.selected) {
        filter = element;
      }
    });
    this._shareService.getReportPaymentRequest(data).subscribe(
      response => {
        if (response.return) { 
          this.users = [];
          this.total = 0;
          response.data.forEach((element: any) => {
            element.amount_receiver=parseFloat(element.amount_receiver);
            if (_.includes(element.name, filter.title)) {
              this.listStatus.forEach(status => {
                if (status.value === element.status) {
                  element.status = status.label;
                }
              });
              this.total += parseFloat(element.amount_receiver ? element.amount_receiver : 0);
              this.users.push(element);
              
            }
          });
          this.buildPie(filter);
          this.cols = [];
          Object.keys(this.users[0]).forEach(element => {
            this.setCols(element);
          });
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          this._router.navigate(['/dash']);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
        this._router.navigate(['/login']);
      }
    );
  }

  buildPie(filter) {
    if (filter.title === '') {
      this.buildPieForBusiness();
      return;
    }
    const labels = {};
    this.users.forEach(
      element => {
        if (labels[element.stage] !== undefined) {
          labels[element.stage] = labels[element.stage] + element.quantity;
        } else {
          labels[element.stage] = element.quantity;
        }
      }
    );
    const data = [];
    const colors = [];
    Object.keys(labels).forEach(element => {
      data.push(labels[element]);
      colors.push(this.getRandomColor());
    });
    this.data = {
      labels: Object.keys(labels),
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          hoverBackgroundColor: colors
        }]
    };
  }

  buildPieForBusiness() {
    const labels = {};
    this.business.forEach(
      element => {
        if (element.value !== 'Todos' && labels[element.value] === undefined) {
          labels[element.value] = 0;
        }
        this.users.forEach(user => {
          if (user.name === element.title) {
            labels[element.value] = labels[element.value] + user.quantity;
          }
        });
      }
    );
    const data = [];
    const colors = [];
    Object.keys(labels).forEach(element => {
      data.push(labels[element]);
      colors.push(this.getRandomColor());
    });
    this.data = {
      labels: Object.keys(labels),
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          hoverBackgroundColor: colors
        }]
    };
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  setCols(element) {
    switch (element) {
      case 'name':
        this.cols.push({
          field: element,
          header: 'Nome',
        });
        break;
      case 'quantity':
        this.cols.push({
          field: element,
          header: 'Quantidade',
        });
        break;
      case 'amount_receiver':
        this.cols.push({
          field: element,
          header: 'Valor Recebido',
        });
        break;
      case 'status':
        this.cols.push({
          field: element,
          header: 'Situação',
        });
        break;
      case 'stage':
        this.cols.push({
          field: element,
          header: 'Etapa',
        });
        break;
      case 'id':
        break;
      default:
        this.cols.push({
          field: element,
          header: _.upperFirst(element).replace(new RegExp('_'), ' '),
        });
        break;
    }
  }
  packSoldDetails(data) {
    this._router.navigate(['/reports/pack-sold/pack-sold-details'], {
      queryParams: {
        id: data.id,
        stage: data.stage,
      }
    });
  }

}
