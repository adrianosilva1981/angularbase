import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';
import { ConfirmationService } from 'primeng/api';
import { SharedService } from '@app-hyper-store/services/shared.service';
import { HyperToastsService } from 'projects/lib-services/src/public_api';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-hyper-store-voucher-valid',
  templateUrl: './voucher-valid.component.html',
  styleUrls: ['./voucher-valid.component.less']
})
export class VoucherValidComponent implements OnInit {

  public voucher = '768L-OydJ-gTKD';
  public objVoucher: any;
  public load = false;
  public showQrScanner = true;

  public registerForm: FormGroup;

  public VOUCHERMASK = [/[A-Za-z0-9]/, /[A-Za-z0-9]/, /[A-Za-z0-9]/, /[A-Za-z0-9]/, '-', /[A-Za-z0-9]/, /[A-Za-z0-9]/, /[A-Za-z0-9]/, /[A-Za-z0-9]/, '-', /[A-Za-z0-9]/, /[A-Za-z0-9]/, /[A-Za-z0-9]/, /[A-Za-z0-9]/];

  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _confirmationService: ConfirmationService
  ) {
    this.registerForm = new FormGroup({
      voucher: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(14)])
      )
    });
  }

  ngOnInit() {
    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Dashboard', 'router': '/supplier/dash' },
        { 'text': 'Validar Cupons Smart', 'router': '' }
      ]
    );

    this.qrScannerComponent.getMediaDevices().then(devices => {
      const videoDevices: MediaDeviceInfo[] = [];
      for (const device of devices) {
        if (device.kind.toString() === 'videoinput') {
          videoDevices.push(device);
        }
      }
      if (videoDevices.length > 0) {
        let choosenDev;
        for (const dev of videoDevices) {
          if (dev.label.includes('back')) {
            choosenDev = dev;
            break;
          }
        }
        if (choosenDev) {
          this.qrScannerComponent.chooseCamera.next(choosenDev);
        } else {
          this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
        }
      }
    });

    this.qrScannerComponent.capturedQr.subscribe(result => {
    });
  }

  capturedQr(value) {
    this.voucher = value;
    this.validVoucher();
  }

  validVoucher() {
    if (this.voucher !== '') {
      this._sharedService.validVoucher(this.voucher).subscribe(
        (response: any) => {
          if (response.return) {
            this.objVoucher = response.data;
            this.confirm();
          } else {
            this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          }
        },
        err => {
          this._hyperToastsService.addToast('error', 'Erro', err);
        }
      );
    } else {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Cupom Smart inválido');
    }
  }

  confirm() {
    this._confirmationService.confirm({
      header: 'Utilizar Cupom Smart',
      message: 'Marcar Cupom Smart <b>"' + this.voucher + '"</b> como utilizado? <br> <b>Essa ação é irreversível.</b><br><br>' +
        '<b>Dados:</b><br>' +
        '<br>Nome: ' + this.objVoucher.title +
        '<br>Valor: ' + this.objVoucher.price +
        '<br>Descrição: ' + this.objVoucher.description,

      accept: () => {
        this.load = true;

        const data = {
          voucher: this.voucher
        };

        this._sharedService.usedVoucher(data).subscribe(
          (response: any) => {
            if (response.return) {
              this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
            }
          },
          err => {
            this._hyperToastsService.addToast('error', 'Erro', err);
          }
        );
      }
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.voucher = this.registerForm.controls.voucher.value;
      this.validVoucher();
    }
  }
}
