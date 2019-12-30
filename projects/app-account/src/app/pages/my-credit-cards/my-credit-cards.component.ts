import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-account/services/shared.service';
import { HyperToastsService, BroadcastEventService } from 'lib-services';

@Component({
  selector: 'app-account-my-credit-cards',
  templateUrl: './my-credit-cards.component.html',
  styleUrls: ['./my-credit-cards.component.less']
})
export class MyCreditCardsComponent implements OnInit {

  public objCreditCard: any;
  public loading = false;

  constructor(
    private _sharedService: SharedService,
    private _messageService: HyperToastsService,
  ) { }

  ngOnInit() {
    this.getMyCreditCards();

    BroadcastEventService.event('onBreadCrumb').emit(
      [
        { 'text': 'Minha Conta', 'router': '/home' },
        { 'text': 'Formas de Pagamento', 'router': '/my-credit-cards' }
      ]
    );
  }

  getMyCreditCards() {
    this.loading = true;
    this._sharedService.getMyCreditCards().subscribe(
      (response: any) => {
        if (response.return) {
          this.objCreditCard = response.data;
          this.loading = false;
        } else {
          this.loading = false;
          this._messageService.addToast('warn', 'Atenção!', response.msg);
        }
      },
      err => {
        this.loading = false;
        this._messageService.addToast('error', 'Erro!', err);
      }
    );
  }

  deleteCC(idCC) {
    const positionCC = this.objCreditCard.findIndex(x => x.id === idCC);

    this._sharedService.deleteMyCreditCard(idCC).subscribe(
      (response: any) => {
        if (response.return) {
          this.objCreditCard.splice(positionCC, 1);
          this._messageService.addToast('success', 'Sucesso!', response.msg);
        } else {
          this._messageService.addToast('warn', 'Atenção!', response.msg);
        }
      }
    );
  }


}
