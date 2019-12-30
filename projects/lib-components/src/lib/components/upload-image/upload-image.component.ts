import { Component, OnInit, Output, Input, EventEmitter, OnDestroy } from '@angular/core';
import { HyperToastsService } from 'lib-services';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { ModalCropImageComponent } from '../modal-crop-image/modal-crop-image.component';
import { SharedService } from '../../services/shared.service';
import fileUpload from 'fuctbase64';

@Component({
  selector: 'lib-components-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.less']
})
export class UploadImageComponent implements OnInit, OnDestroy {
  public imageUpload: any;
  public nameInput = 'input_' + new Date().getTime() + (Math.random() * 1000);
  private subscription_dialog = new Subscription;
  private subscription_request = new Subscription;

  @Input() urlRequest: string;
  @Input() width: Number;
  @Input() height: Number;
  @Input() pathBucket: string;
  @Input() buttonText: '<i class="fas fa-plus"></i><span> Adicionar imagens/videos</span>';
  @Output() onUpload = new EventEmitter();

  constructor(
    private _hyperToastsService: HyperToastsService,
    private _sharedService: SharedService,
    private _dialog: MatDialog
  ) { }

  ngOnInit() { }

  openModalCrop(event) {
    const types: any = {
      image: ['image/jpeg', 'image/png'],
      video: ['video/mp4', 'video/x-flv', 'video/3gpp', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv']
    };
    const file = event.target.files[0];

    if (types.image.includes(file.type)) {
      this.openModalCropImage(event);
    } else if (types.video.includes(file.type)) {
      this.uploadImage(file);
      // fileUpload(event).then(res => {
      //   debugger;
      //   this.uploadImage(`data:${res.type};base64,${res.base64}`);
      // });
    } else {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Somente arquivos de videos e imagens');
    }

  }

  openModalCropImage(event) {
    const dialogRef = this._dialog.open(
      ModalCropImageComponent,
      {
        data: {
          event: event,
          width: this.width,
          height: this.height,
        },
        panelClass: 'globalModalHJ'
      });
    this.subscription_dialog = dialogRef.afterClosed().subscribe(
      result => {
        this.subscription_dialog.unsubscribe();
        this.subscription_request.unsubscribe();
        if (result) {
          const file = this.b64toBlob(result.image, event.target.files[0], 512);
          this.uploadImage(file);
        }
      });
  }
  uploadImage(file) {
    this.subscription_request = this._sharedService.postImageS3(this.pathBucket, file, this.urlRequest).subscribe(
      response => {
        if (response.return) {
          this.onUpload.emit(response.data);
          this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
        } else {
          this._hyperToastsService.addToast('error', 'Erro', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro ao subir a imagem');
      }
    );
  }

  b64toBlob(b64Data, content, sliceSize) {
    const imageUpload = content;
    b64Data = b64Data.split(',')[1];
    const contentType = content.type || '';
    sliceSize = sliceSize || 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    const file = new File([blob], imageUpload.name, { type: contentType, lastModified: Date.now() });
    return file;
  }

  ngOnDestroy() {
    this.subscription_dialog.unsubscribe();
    this.subscription_request.unsubscribe();
  }
}
