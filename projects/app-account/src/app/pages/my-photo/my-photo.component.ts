import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BroadcastEventService, HyperToastsService } from 'lib-services';
import { SharedService } from '@app-account/services/shared.service';
import { CropPhotoModalComponent } from '@app-account/pages/crop-photo-modal/crop-photo-modal.component';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { environment } from '@env/app-account';

@Component({
  selector: 'app-account-my-photo',
  templateUrl: './my-photo.component.html',
  styleUrls: ['./my-photo.component.less']
})
export class MyPhotoComponent implements OnInit {

  public loading = false;
  @ViewChild('profilePicInput')
  myPivInput: any;
  public uploader = new FileUploader({});
  private uOptions: FileUploaderOptions = {};
  public URL;
  public profilePic: any = {};
  public objProfile: any = {
    'user': {},
    'address': {},
    'profile': {},
    'language': [{}],
    'email': [{}],
    'socialMedia': [{}],
    'areasInterest': [{}],
    'skills': [{}]
  };

  constructor(
    private _sharedService: SharedService,
    private _dialog: MatDialog,
    private _messageService: HyperToastsService,
  ) { }

  ngOnInit() {

    BroadcastEventService.event('onBreadCrumb').emit(
      [
        { 'text': 'Minha Conta', 'router': '/home' },
        { 'text': 'Minha Foto', 'router': '/my-photo' }
      ]
    );

    this.getMyProfile();

  }

  getMyProfile() {
    this.loading = true;
    this._sharedService.getMyProfile().subscribe(
      (response: any) => {
        if (response.return) {
          this.objProfile = response.data;
          // console.log(this.objProfile);
          this.loading = false;
          if (this.validateInputText(this.objProfile.user.photo)) {
            this.profilePic.name = this.objProfile.user.photo;
          } else {
            this.profilePic.name = '//files.hyper.jobs/user/profile/default-profile.png';
          }

          this.URL = environment.apiPhp + 'user/imageUpload';

          this.uOptions.url = this.URL;
          this.uOptions.authToken = 'Bearer ' + this._sharedService.getUserToken();
          this.uploader.setOptions(this.uOptions);
          this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
          };

          this.uploader.onCompleteItem = (item: any, response1: any, status: any, headers: any) => {
            const responseJSON = JSON.parse(response1);
            if (responseJSON.return) {

              this.profilePic.name = responseJSON.data;
              const params = {};
              params['photo'] = this.profilePic.name;

              this._sharedService.updateUserPhoto(params).subscribe((response2: any) => {
                if (response2.return) {

                  this._messageService.addToast('success', 'Sucesso!', response2.msg);
                } else {
                  this._messageService.addToast('warning', 'Atenção!', response2.msg);
                }
              },
                err => {
                  this._messageService.addToast('error', 'Erro!', err);
                }
              );
            } else {
              this._messageService.addToast('error', 'Erro!', responseJSON.msg);
            }
          };
        } else {
          this.loading = false;
          this._messageService.addToast('warning', 'Atenção!', response.msg);
        }
      }
    );
  }

  validateInputText(value) {
    if (value !== '' && value != null && value !== undefined) {
      return true;
    }
    return false;
  }

  profilePictureChangeListener(event) {
    this.openDialog(event);
  }

  openDialog(event) {
    const dialogRef = this._dialog
      .open(CropPhotoModalComponent,
        {
          data: {
            event: event
          }
        });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const img = this._sharedService.getProfilePic();
        const teste: File[] = [];
        teste.push(this.b64toBlob(result.image, img.type, 512));
        this.uploader.clearQueue();
        this.uploader.addToQueue(teste);
        this.uploader.uploadAll();
      }
      this.myPivInput.nativeElement.value = '';

    });
  }

  b64toBlob(b64Data, contentType, sliceSize) {
    b64Data = b64Data.split(',')[1];
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let idx = 0; idx < slice.length; idx++) {
        byteNumbers[idx] = slice.charCodeAt(idx);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    const file = new File([blob], this._sharedService.getProfilePic().name, { type: contentType, lastModified: Date.now() });
    return file;
  }

}
