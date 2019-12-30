import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';


import { HyperToastsService } from 'lib-services';

import { SharedService } from '@app-admin-back-office/services/shared.service';

@Component({
  selector: 'app-admin-back-office-debit-associate',
  templateUrl: './debit-associate.component.html',
  styleUrls: ['./debit-associate.component.less']
})
export class DebitAssociateComponent implements OnInit {

  associate: any;
  debitValue: any;

  constructor(
    private _sharedService: SharedService,
    private _activatedRoute: ActivatedRoute,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
  ) {
    this.getAssociate(Number.parseInt(this._activatedRoute.snapshot.paramMap.get('associate').toString()));
  }

  ngOnInit() {
  }

  getAssociate(id: number) {
    this._sharedService.getOneAssociate(id).subscribe(
      response => {
        this.associate = response.data;
      },
      err => {
        this._hyperToastsService.addToast('error', 'Error', err.msg);
      });
  }

  debitAction(extract: string, description: string, value: string) {
    if (value === '' || extract === '' || description === '') {
      this._hyperToastsService.addToast('warn', 'Atenção!', 'Precisa de valor, extrato e descrição!');
      return;
    }
    swal({
      title: 'Deseja realmente debitar\n' + value + '\nde\n' + this.associate.name + '?',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then(
      (result) => {
        if (result.value) {
          const data = {
            id: this.associate.id,
            extract: extract,
            description: description,
            value: this.debitValue,
          };
          this._sharedService.insertDebit(data).subscribe(
            response => {
              if (response.return) {
                this._hyperToastsService.addToast('success', 'Sucesso', 'Débito realizado com sucesso!');
              } else {
                this._hyperToastsService.addToast('error', 'Error', response.msg);
              }
              this._router.navigate(['/associates/debit']);
            },
            err => {
              this._hyperToastsService.addToast('error', 'Error', err.msg);
              this._router.navigate(['/associates/debit']);
            });
        }
      },
      err => {
        this._router.navigate(['/associates/debit']);
      });
  }
}
