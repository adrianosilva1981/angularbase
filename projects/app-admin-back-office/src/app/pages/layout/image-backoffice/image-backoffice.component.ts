import { HyperToastsService } from 'lib-services';
import { DataTable } from 'primeng/primeng';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-admin-back-office-image-backoffice',
  templateUrl: './image-backoffice.component.html',
  styleUrls: ['./image-backoffice.component.less']
})
export class ImageBackofficeComponent implements OnInit {

  public images: any[] = [];
  public cols: any[] = [];
  public display = false;
  public urlImg: string = null;
  public typeImages: any[] = [];

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) {
    this.setImages();
    this.setTypesImages();
  }

  ngOnInit() {
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

  setImages() {
    this._sharedService.getImages().subscribe(
      response => {
        if (response.return) {
          this.images = JSON.parse(response.data);
          this.images.forEach(banner => { banner.status = banner.status === 'ENABLE' ? true : false; });
          Object.keys(this.images[0]).forEach((col: string) => {
            this.setCols(col);
          });
        } else {

        }
      },
      err => {

      }
    );
  }

  setCols(col: string) {
    switch (col) {
      case 'title':
        this.cols.push({
          field: col,
          header: 'Título'
        });
        break;
      case 'url_desktop':
        this.cols.push({
          field: col,
          header: 'Desktop'
        });
        break;
      case 'url_mobile':
        this.cols.push({
          field: col,
          header: 'Mobile'
        });
        break;
      case 'position':
        this.cols.push({
          field: col,
          header: 'Posição'
        });
        break;
      case 'type':
        this.cols.push({
          field: col,
          header: 'Tipo'
        });
        break;
      case 'comments':
      case 'id': break;

      default:
        this.cols.push({
          field: col,
          header: _.upperFirst(col).replace(new RegExp('_'), ' ')
        });
        break;
    }
  }

  position(banner: any, index: number) {
    banner.position = index;
  }

  onRowReorder(dt: DataTable) {
    setTimeout(() => {
      for (let index = 0, positionBanner = 0, positionPopup = 0; index < dt.value.length; index++) {
        dt.value[index].position = dt.value[index].status ? (dt.value[index].type === 'BANNER' ? positionBanner++ : positionPopup++) : null;
      }
      const data = {
        images: dt.value
      };
      this._sharedService.setImages(data).subscribe(
        response => {
          if (response.return) {
            // this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
          } else {
            this._hyperToastsService.addToast('error', 'Error', 'Aconteceu algum problema, entre em contato com o suporte!');
            console.error(response);
          }
        }, err => {
          this._hyperToastsService.addToast('error', 'Error', 'Aconteceu algum problema, entre em contato com o suporte!');
          console.error(err);
        });
    }, dt.filterDelay);

  }

  click(url) {
    this.display = true;
    this.urlImg = 'http://' + url;
  }

}
