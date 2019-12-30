import { Component, OnInit } from '@angular/core';
import { HyperToastsService, BroadcastEventService } from 'lib-services';
import { Router } from '@angular/router';
import { SharedService } from '@app-hyper-store/services/shared.service';

@Component({
  selector: 'app-hyper-store-edit-gift-card',
  templateUrl: './edit-gift-card.component.html',
  styleUrls: ['./edit-gift-card.component.less']
})
export class EditGiftCardComponent implements OnInit {

  public show = true;
  public companies = [];
  private idSupplier: any;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router
  ) { }

  ngOnInit() {
    // this.getSupplierId();
    this.getGiftCard();

    const obj = [
      { 'text': 'Dashboard', 'router': '/supplier/dash' },
      { 'text': 'Meus Cupons Smart', 'router': '' }
    ];

    BroadcastEventService.event('onBreadCrumb').emit(obj);

    BroadcastEventService.event('onDeleteGiftCard').subscribe(
      response => {
        if (response) {
          this.getGiftCard();
        }
      }
    );
  }

  getGiftCard() {
    this._sharedService.getGiftCardByUserId().subscribe(
      response => {
        if (response.return) {
          response.data.forEach(element => {
            if (element.mediasForm.images !== null && element.mediasForm.images.length !== '') {
              element.mediasForm.images = JSON.parse('[' + element.mediasForm.images + ']');
            }

            if (element.companyForm.list_company !== null && element.companyForm.list_company !== '') {
              element.companyForm.list_company = JSON.parse('[' + element.companyForm.list_company + ']');
            }

            if (element.priceForm.priceForm != null && element.priceForm.priceForm !== '') {
              element.priceForm = JSON.parse(element.priceForm.priceForm);
            }

            this.companies = [];
            this.companies = this.companies.concat(response.data);
            this._sharedService.saveProducts(this.companies);
          });
        }
      }, err => { this._hyperToastsService.addToast('error', 'Erro', err); }
    );
  }

  getSupplierId() {
    this._sharedService.getSupplier().subscribe(
      response => {
        if (response.return) {
          this.idSupplier = response.data.id;
          this.getGiftCard();
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', err); }
    );
  }
}
