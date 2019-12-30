import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { MatDialog } from '@angular/material';

import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';
import { InfoPackComponent } from '@app-back-office/components/modals/info-pack/info-pack.component';

@Component({
  selector: 'app-back-office-access-plans',
  templateUrl: './access-plans.component.html',
  styleUrls: ['./access-plans.component.less']
})
export class AccessPlansComponent implements OnInit {

  public plans = [];
  public voucherForm: FormGroup;
  public cookieBusinnes: any;

  public planLoading = false;
  public planCheck = false;
  public planCheckfalse = false;

  public pacotes: any = {};

  public maskotto_capital = 0;
  public maskotto_lucro = 0;
  public maskotto_value_sale = 152.30;
  public maskotto_value_resale = 260.00;

  public cria_capital = 0;
  public cria_lucro = 0;
  public cria_value_sale = 239.40;
  public cria_value_resale = 399.00;

  public k18_capital = 0;
  public k18_lucro = 0;
  public k18_value_sale = 731.50;
  public k18_value_resale = 1463.00;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
    private fb: FormBuilder,
    public _dialog: MatDialog
  ) {
    this.getAccesPlans('office');

    this.maskotto_lucro = Number(this.maskotto_value_resale) - Number(this.maskotto_value_sale);
    if (Number(this.maskotto_value_sale) > 0) {
      this.maskotto_capital = Math.ceil((this.maskotto_lucro * 100) / Number(this.maskotto_value_sale));
    }

    this.cria_lucro = Number(this.cria_value_resale) - Number(this.cria_value_sale);
    if (Number(this.cria_value_sale) > 0) {
      this.cria_capital = Math.ceil((this.cria_lucro * 100) / Number(this.cria_value_sale));
    }

    this.k18_lucro = Number(this.k18_value_resale) - Number(this.k18_value_sale);
    if (Number(this.k18_value_sale) > 0) {
      this.k18_capital = Math.ceil((this.k18_lucro * 100) / Number(this.k18_value_sale));
    }

  }

  ngOnInit() {

    this.voucherForm = this.fb.group({
      voucherControl: ['', [Validators.required]]
    });

    this.pacotes = [
    //   {
    //   id: 2,
    //   //image: 'assets/img/header_maskotto.jpg',
    //   //label: 'alta',
    //   label_text: 'Em alta no Mercado',
    //   title: 'Pack de Produtos Pet Shop',
    //   value_sale: this.maskotto_value_sale,
    //   value_resale: this.maskotto_value_resale,
    //   lucro: this.maskotto_lucro,
    //   currency: 'BRL',
    //   capital: this.maskotto_capital,
    //   detalhe: 'assets/img/PACKMASKOTO.png',
    // }
    //,
      // {
      //   id: 3,
      //   //image: 'assets/img/header_cria.jpg',
      //   //label: 'lancamento',
      //   label_text: 'Lançamento',
      //   title: 'Pack 10 Livros Infantis Personalizados',
      //   value_sale: this.cria_value_sale,
      //   value_resale: this.cria_value_resale,
      //   lucro: this.cria_lucro,
      //   currency: 'BRL',
      //   capital: this.cria_capital,
      //   detalhe: 'assets/img/livro.jpg',
      // },
      // {
      //   id: 6,
      //   //image: 'assets/img/header_cria.jpg',
      //   //label: 'lancamento',
      //   label_text: 'Lançamento',
      //   title: 'Pack 18K Ronaldinho',
      //   value_sale: this.k18_value_sale,
      //   value_resale: this.k18_value_resale,
      //   lucro: this.k18_lucro,
      //   currency: 'BRL',
      //   capital: this.k18_capital,
      //   detalhe: 'assets/img/18kronaldinho.jpg',
      // }
    ];
  }

  // ************************** validar voucher ****************************
  validVoucher() {

    this.planLoading = true;
    this.planCheck = false;
    this.planCheckfalse = false;

    this._sharedService.validVoucher(this.voucherForm.controls.voucherControl.value, 'office').subscribe(response => {

      if (response.return) {

        this.planLoading = false;
        this.planCheck = true;
        this.planCheckfalse = false;

        // swal({
        //   title: 'Voucher válido!',
        //   text: 'Você quer ativar seu voucher agora?',
        //   type: 'warning',
        //   showCancelButton: true,
        //   confirmButtonColor: '#3085d6',
        //   cancelButtonColor: '#d33',
        //   confirmButtonText: 'Sim, ativar agora!',
        //   cancelButtonText: 'Não, depois!',
        //   confirmButtonClass: 'btn btn-success',
        //   cancelButtonClass: 'btn btn-danger',
        //   buttonsStyling: false,
        //   reverseButtons: true
        // }).then((result) => {

        // })

        swal(
          'Sucesso!',
          'Seus voucher foi Aplicado aos planos!',
          'success'
        );

        this.plans = response.data;

        this.plans.forEach(element => {
          element.value = parseFloat(element.value);
          element.monthly_value = parseFloat(element.monthly_value);
        });

      } else {
        this.planLoading = false;
        this.planCheck = false;
        this.planCheckfalse = true;
        this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
      }
    },
      err => {
        this.planLoading = false;
        this.planCheck = false;
        this.planCheckfalse = true;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }


  // ************* busca os planos de adesao nesta empresa *****************
  getAccesPlans(slug) {

    this._sharedService.getAccesPlans(slug).subscribe(response => {
      if (response.return) {
        this.plans = response.data;
        this.plans.forEach(element => {
          element.value = parseFloat(element.value);
          element.monthly_value = parseFloat(element.monthly_value);
        });
        //console.log(this.plans);
      } else { this._hyperToastsService.addToast('warn', 'Atenção', response.msg); }
    },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  selectPlan(idPlan, voucher) {
    this._router.navigate(['office/checkout'], { queryParams: { plan: idPlan } }); // planos de adesão
  }

  modalPack(imagem) {
    const dialogRef = this._dialog.open(InfoPackComponent, {
      data: { image: imagem },
    });
    dialogRef.afterClosed().subscribe(
      result => { });
  }
}

