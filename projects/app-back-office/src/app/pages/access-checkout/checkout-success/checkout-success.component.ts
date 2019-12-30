import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@app-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-back-office-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.less']
})
export class CheckoutSuccessComponent implements OnInit {

  public userNameCompany: string;
  public idCompany: number;
  public idPlan: number;
  public voucher: string;
  public user: any = {};
  public urlBillet: any = {};
  public method = '';
  public financing = '';

  constructor(
    private route: ActivatedRoute,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) {

    this.route.queryParams.subscribe(queryparams => {
     this.method = queryparams['method'];
     this.financing = queryparams['financing'];
    });

  }

  ngOnInit() {

    this._sharedService.checkreseller().subscribe((response: any) => {
      if (response.return) {
        this.user = response.data;
        //console.log(this.method);

        if (this.method == 'ticket') {
          this._sharedService.getUrlBillet('').subscribe(response4 => {
            if (response4.return) {
              this.urlBillet = response4.data;
              //console.log(this.urlBillet);
            } else {
              this.urlBillet = {};
            }
          },
            err => {
              this.urlBillet = {};
              this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
            }
          );
        } else {
          this.urlBillet = {};
        }

      } else {
        this.urlBillet = {};
      }
    },
      err => {
        this.urlBillet = {};
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );



  }



}
