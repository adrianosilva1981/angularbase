import { HyperToastsService } from 'lib-services';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/app-admin-back-office';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { Router } from '@angular/router';
import { Dropdown } from 'primeng/primeng';
import * as _ from 'lodash';

@Component({
  selector: 'app-admin-back-office-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.less']
})
export class UploadImageComponent implements OnInit {

  public urlUploadImage = environment.apiPhp + 'tools/uploadImage';
  public title: string;
  public comment: string;
  public urlDesktop = null;
  public urlMobile = null;
  public urlPopUp = null;
  public link = null;
  public buttonDesktop = '<div class="btn btn-secondary">Upload Desktop</div>';
  public buttonMobile = '<div class="btn btn-secondary">Upload Mobile</div>';
  public buttonPopUp = '<div class="btn btn-secondary">Upload PopUp</div>';
  public typeImages: any[] = [];


  constructor(
    private _hyperToastsService: HyperToastsService,
    private _sharedService: SharedService,
    private _router: Router,
  ) {
    this.setTypesImages();
  }

  ngOnInit() {
  }

  desktop(evt) {
    this.urlDesktop = evt;
  }

  mobile(evt) {
    this.urlMobile = evt;
  }

  popup(evt) {
    this.urlPopUp = evt;
  }

  setTypesImages() {
    this._sharedService.getTypesImages().subscribe(
      response => {
        if (response.return) {
          JSON.parse(response.data).forEach((type: { value: string }) => {
            this.typeImages.push({
              value: type.value,
              label: _.upperFirst(type.value.toLowerCase())
            });
          });
        } else {
          this._hyperToastsService.addToast('error', 'Error', 'Aconteceu algum problema, entre em contato com o suporte!');
          console.error(response);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Error', 'Aconteceu algum problema, entre em contato com o suporte!');
        console.error(err);
      }
    );
  }

  uploadImage(pdd: Dropdown = null) {
    if (!pdd) {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Preencha todos os campos!');
      return;
    }
    const data = {
      title: this.title,
      comment: this.comment,
      urlDesktop: pdd.value === 'BANNER' ? this.urlDesktop : this.urlPopUp,
      urlMobile: pdd.value === 'BANNER' ? this.urlMobile : this.urlPopUp,
      type: pdd.value,
      link: this.link
    };
    this._sharedService.uploadBanner(data).subscribe(
      response => {
        if (response.return) {
          this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
          this._router.navigate(['/admin/image-backoffice']);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      }, err => {
        this._hyperToastsService.addToast('error', 'Atenção', 'Aconteceu algum error, entre em contato com o suporte!');
        console.error(err);
      }
    );
  }

}
