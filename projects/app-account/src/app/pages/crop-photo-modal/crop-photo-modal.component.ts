import { Component, OnInit, ViewChild, Inject } from '@angular/core';
 import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
 import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
 import { SharedService } from '@app-account/services/shared.service';

@Component({
  selector: 'app-account-crop-photo-modal',
  templateUrl: './crop-photo-modal.component.html',
  styleUrls: ['./crop-photo-modal.component.less']
})
export class CropPhotoModalComponent implements OnInit {

  profilePic: any;
  cropperProfilePictureSettings: CropperSettings;
  showProfilePictureCropBox = false;
  showProfilePicturePreview = false;
  canvasWidth = 500;
  canvasHeight = 300;
  public urlProfilePic = '//files.hyper.jobs/user/profile/default-profile.png';

  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;

  constructor(
     public dialogRef: MatDialogRef<CropPhotoModalComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
     private _sharedService: SharedService,
  ) {
     if (window.innerWidth < 500) {
       this.canvasWidth = 280;
       this.canvasHeight = 200;
     }
     if (window.innerHeight < 500) {
       this.canvasHeight = 130;
     }

    this.cropperProfilePictureSettings = new CropperSettings();
    this.cropperProfilePictureSettings.width = 200;
    this.cropperProfilePictureSettings.height = 200;
    this.cropperProfilePictureSettings.croppedWidth = 200;
    this.cropperProfilePictureSettings.croppedHeight = 200;
    this.cropperProfilePictureSettings.canvasWidth = this.canvasWidth;
    this.cropperProfilePictureSettings.canvasHeight = this.canvasHeight;
    this.cropperProfilePictureSettings.minWidth = 100;
    this.cropperProfilePictureSettings.minHeight = 100;
    this.cropperProfilePictureSettings.noFileInput = true;
    this.cropperProfilePictureSettings.rounded = false;
    this.cropperProfilePictureSettings.keepAspect = true;
    this.cropperProfilePictureSettings.preserveSize = false;
    this.cropperProfilePictureSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperProfilePictureSettings.cropperDrawSettings.strokeWidth = 2;

    this.profilePic = {};

    this.profilePictureChangeListener(this.data.event);

  }

  profilePictureChangeListener($event) {
    this.showProfilePictureCropBox = true;
    this.loadImageToPreview($event);
    this.showProfilePicturePreview = true;
  }

  loadImageToPreview($event) {
    const image: any = new Image();
    const file: File = $event.target.files[0];

    this._sharedService.setProfilePic(file);
    const myReader: FileReader = new FileReader();
    const that = this;
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);
    };

    myReader.readAsDataURL(file);
  }

  ngOnInit() {
  }

}
