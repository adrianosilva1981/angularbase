import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'projects/lib-services/src/lib/services/hyper-toasts.service';
import * as _ from 'lodash';



@Component({
  selector: 'app-admin-back-office-commissions',
  templateUrl: './commissions.component.html',
  styleUrls: ['./commissions.component.less']
})
export class CommissionsComponent implements OnInit {

  users: any[];
  cols = [];

  constructor(
    private _shareService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
    // private _dialog: MatDialog,
    private _activatedRoute: ActivatedRoute, ) {

  }

  ngOnInit() {
    this.users = [
      {
        id: '1',
        name: 'José',
        adesao: '2500',
        mensalidade: '500',
        'produtos ou servicos': '1500',
      },
      {
        id: '2',
        name: 'João',
        adesao: '5000',
        mensalidade: '500',
        'produtos ou servicos': '1500',
      },
      {
        id: '3',
        name: 'Maria',
        adesao: '3000',
        mensalidade: '500',
        'produtos ou servicos': '1500',
      },
    ];
    Object.keys(this.users[0]).forEach(element => {
      if (_.lowerCase(element) !== 'id') {
        this.cols.push({ field: element, header: _.upperFirst(_.lowerCase(element)) });
      }
    });

    // this._shareService.getCommissions().subscribe(
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
  onRowSelect(event) {
    console.log(JSON.stringify(event.data));
    this._router.navigate(['/commissions/' + event.data.id]);
  }

  getTotal(user) {
    const keyUser = [];
    Object.keys(user).forEach(element => {
      if (_.lowerCase(element) !== 'name' && _.lowerCase(element) !== 'id') {
        keyUser.push(element);
      }
    });
    let result = 0;
    // console.log(keyUser);
    keyUser.forEach(element => {
      // console.log(typeof(user[element]));
      // console.log(parseFloat(user[element]));
      // if (parseFloat(user[element]) > 0) {
        result += parseFloat(user[element]);
      // }
    });
    return result;
  }

}
