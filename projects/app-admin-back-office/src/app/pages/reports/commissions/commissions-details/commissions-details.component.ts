import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'projects/lib-services/src/lib/services/hyper-toasts.service';
import * as _ from 'lodash';



@Component({
  selector: 'app-admin-back-office-commissions-details',
  templateUrl: './commissions-details.component.html',
  styleUrls: ['./commissions-details.component.less']
})
export class CommissionsDetailsComponent implements OnInit {

  user: any;
  tabs = [];
  cols = {};

  constructor(
    private _shareService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
    // private _dialog: MatDialog,
    private _activatedRoute: ActivatedRoute, ) {

  }

  ngOnInit() {
    const id = this._activatedRoute.params['id'];
    // this._shareService.getCommissions(id).subscribe(
    //   response => {
    //     if (response.return) {
    //       this.users = response.data;
    //     } else {
    //       this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
    //     }
    //   },
    //   err => {
    //     this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
    //     this._router.navigate(['/login']);
    //   }
    // );
    this.user = {
      'name': 'José',
      'adesoes': [{ date: Date.now(), desc: 'Descrição', value: 100, comission: 100 }],
      'mensalidades': [{ date: Date.now(), desc: '', value: 0, comission: 0 }],
      'Produtos e Serviços': [{ date: Date.now(), desc: '', value: 0, comission: 0 }]
    };
    let fields = [{}];
    Object.keys(this.user).forEach(tab => {
      if (_.lowerCase(tab) !== 'name') {
        this.tabs.push({ field: tab, header: _.upperFirst(_.lowerCase(tab)) });
      }
    });
    this.tabs.forEach(col => {
      fields = [];
      Object.keys(this.user[col.field][0]).forEach(field => {
        fields.push({ field: field, header: _.upperFirst(_.lowerCase(field)) });
      });
      this.cols[col.field] = fields;
    });
    // console.log(this.cols);

    // });
    // Object.keys(this.user['adesoes'][0]).forEach(element => {
    //   this.colsExtrato.push({ field: element, header: _.upperFirst(_.lowerCase(element)) });
    //   });

    // this._shareService.getUsers().subscribe(
    //   response => {
    //     if (response.return) {
    //       this.users = response.data;
    //       Object.keys(this.users[0]).forEach(element => {
    //         this.cols.push({ field: element, header: _.upperFirst(element) });
    //       });
    //     } else {
    //       this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
    //     }
    //   },
    //   err => {
    //     this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
    //     this._router.navigate(['/login']);
    //   }
    // );
  }
  // onRowSelect(event) {
  //   console.log(JSON.stringify(event.data));
  //   this._router.navigate(['/commissions/' + event.data.name]);
  // }

  getTotal(user) {
    const keyUser = [];
    Object.keys(user).forEach(col => {
      keyUser.push(col);
    });
    let result = 0;
    // console.log(keyUser);
    keyUser.forEach(key => {
      // console.log(typeof(user[element]));
      // console.log(parseFloat(user[element]));
      if (parseFloat(user[key]) > 0) {
        result += parseFloat(user[key]);
      }
    });
    return result;
  }
}
