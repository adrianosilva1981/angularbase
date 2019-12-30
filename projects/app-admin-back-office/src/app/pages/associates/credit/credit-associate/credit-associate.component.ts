import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-back-office-credit-associate',
  templateUrl: './credit-associate.component.html',
  styleUrls: ['./credit-associate.component.less']
})
export class CreditAssociateComponent implements OnInit {

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

  creditAction(extract: string, description: string, value: string) {
    if (value === '' || extract === '' || description === '') {
      this._hyperToastsService.addToast('warn', 'Atenção!', 'Precisa de valor, extrato e descrição!');
      return;
    }
    swal({
      title: 'Deseja realmente creditar\n' + value + '\npara\n' + this.associate.name + '?',
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
          this._router.navigate(['/associates/credit']);
          const data = {
            id: this.associate.id,
            extract: extract,
            description: description,
            value: this.debitValue,
          };
          this._sharedService.insertCredit(data).subscribe(
            response => {
              if (response.return) {
                this._hyperToastsService.addToast('success', 'Sucesso', 'Crédito realizado com sucesso!');
              } else {
                this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
              }
          },
          err => {
            this._hyperToastsService.addToast('error', 'Error', err.msg);
            this._router.navigate(['/associates/credit']);
          });
        }
      },
      err => {
        this._router.navigate(['/associates/credit']);
      });
  }
}
