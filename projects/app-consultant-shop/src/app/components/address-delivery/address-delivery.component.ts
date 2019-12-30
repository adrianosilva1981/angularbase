import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedService } from '@app-consultant-shop/services/shared.service';
import { HyperToastsService, BroadcastEventService } from 'lib-services';
import { MatDialog } from '@angular/material';
import { AddressFormModalComponent } from '@app-consultant-shop/components/address-form-modal/address-form-modal.component';

@Component({
  selector: 'app-consultant-shop-address-delivery',
  templateUrl: './address-delivery.component.html',
  styleUrls: ['./address-delivery.component.less']
})
export class AddressDeliveryComponent implements OnInit {

  @Output() onAddressSelected: EventEmitter<any> = new EventEmitter();
  private cookieVal: any;
  public listAddress: any = [];

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    public _dialog: MatDialog
  ) {
    this.cookieVal = this._sharedService.getUserData();

    BroadcastEventService.event('listenerLoginComponent').subscribe(evt => {
      if (evt.JWT) {
        this.cookieVal = evt;
        this.getListAddress();
      }
    });
  }

  ngOnInit() {
    if (this.cookieVal) {
      this.getListAddress();
    }
  }

  getListAddress() {
    this._sharedService.getDeliveryAddress().subscribe(
      (response: any) => {
        if (response.return) {
          this.listAddress = response.data;

          const ref = response.data.find(x => x.main === true);

          if (ref) {
            this.onAddressSelected.emit(ref);
          }
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', err); }
    );
  }

  selectAddress(address) {
    this.listAddress.forEach(element => {
      element.main = false;
    });
    if (address) {
      this._sharedService.setDeliveryAddressAsMain(address.id).subscribe(
        (response: any) => {
          if (response.return) {
            address.main = true;
            this.onAddressSelected.emit(address);
          } else {
            this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          }
        },
        err => { this._hyperToastsService.addToast('error', 'Erro', err); }
      );
    }
  }

  deleteAddress(idAddress) {
    const positionAddress = this.listAddress.findIndex(x => x.id === idAddress);

    this._sharedService.deleteDeliveryAddress(idAddress).subscribe(
      (response: any) => {
        if (response.return) {
          this.listAddress.splice(positionAddress, 1);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', err); }
    );
  }

  openModalContact() {
    const dialogRef = this._dialog.open(AddressFormModalComponent, {
      data: null,
      panelClass: 'globalModalHJ'
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.listAddress.push(result);
        }
      }
    );
  }
}
