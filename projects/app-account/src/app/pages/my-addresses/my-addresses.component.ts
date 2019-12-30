import { Component, OnInit } from '@angular/core';
import { BroadcastEventService, HyperToastsService } from 'lib-services';
import { SharedService } from '@app-account/services/shared.service';
import { DeliveryAddress } from '@app-account/models/deliveryAddress';

@Component({
  selector: 'app-account-my-addresses',
  templateUrl: './my-addresses.component.html',
  styleUrls: ['./my-addresses.component.less']
})
export class MyAddressesComponent implements OnInit {

  public addressSelected = 'none';
  public objAddress: any = [];
  public loading = false;

  constructor(
    private _sharedService: SharedService,
    private _messageService: HyperToastsService,
  ) { }

  ngOnInit() {

    this.getListAddress();

    BroadcastEventService.event('onBreadCrumb').emit(
      [
        { 'text': 'Minha Conta', 'router': '/home' },
        { 'text': 'Meus Endereços', 'router': '/my-addresses' }
      ]
    );

  }

  getListAddress() {
    this.loading = true;
    // this._sharedService.getListAddress().subscribe(
    //   (response: DeliveryAddress) => {
    //     if (response) {
    //       this.loading = false;
    //       this.objAddress = response;
    //       this.addressSelected = response.deliveryAddress;
    //     }
    //   },
    //   err => {
    //     this.loading = false;
    //     this._messageService.addToast('error', 'Erro!', err);
    //   }
    // );
  }

  deleteAddress(idAddress) {
    const positionAddress = this.objAddress.address.findIndex(x => x._id === idAddress);

    if (this.addressSelected === idAddress) {
      this.selectAddress('none');
    }

    // this._sharedService.pullAddress(idAddress).subscribe(
    //   (response: any) => {
    //     if (response) {
    //       this.objAddress.address.splice(positionAddress, 1);
    //     }
    //   }
    // );
  }

  selectAddress(address) {
    const idAddress = address && address !== 'none' ? address._id : 'none';
    // this._sharedService.setDeliveryAddress(idAddress).subscribe(
    //   response => {
    //     this.addressSelected = idAddress;
    //   }
    // );
  }

}
