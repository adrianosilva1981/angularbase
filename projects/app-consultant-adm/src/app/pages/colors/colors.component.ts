import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { HyperCookieService, HyperToastsService, BroadcastEventService } from 'lib-services';

@Component({
  selector: 'app-consultant-adm-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.less']
})
export class ColorsComponent implements OnInit {
  private idShop: any;
  public skinForm = new FormGroup({
    idHJ: new FormControl(this._hyperCookieService.getCookie_AUTH().id),
    skin: new FormGroup({
      nav: new FormGroup({
        colorBar: new FormControl('#82878C'),
        colorText: new FormControl('#FFFFFF'),
        colorCart: new FormControl('#73B331'),
        colorTextCart: new FormControl('#FFFFFF'),
        colorFav: new FormControl('#EC0036'),
        logo: new FormControl('//files.hyper.jobs/suaLogo.png')
      }),
      footer: new FormGroup({
        colorText: new FormControl('#FFFFFF'),
        colorTitle: new FormControl('#1C5A80'),
        bgColor: new FormControl('#82878C'),
      })
    })
  });
  constructor(
    private _sharedService: SharedService,
    private _hyperCookieService: HyperCookieService,
    private _hyperToastsService: HyperToastsService
  ) {
    this._sharedService.getConsultants().subscribe(
      response => {
        if (response.return) {
          if (response.data.skin) {
            this.idShop = response.data.idShop;
            this.skinForm.get('skin').setValue(response.data.skin);
          }
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
    );
  }

  ngOnInit() {
    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Dashboard', 'router': '/home' },
        { 'text': 'Aparência', 'router': '/skin/colors' },
        { 'text': 'Cores', 'router': '' }
      ]
    );
  }
  sendForm() {
    this._sharedService.putColors(this.idShop, this.skinForm.value).subscribe(
      response => {
        if (response.return) {
          this._hyperToastsService.addToast('success', 'Parabéns', response.msg);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
    );
  }

}
