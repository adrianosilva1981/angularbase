import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'lib-components-modal-crop-image',
  templateUrl: './modal-crop-image.component.html',
  styleUrls: ['./modal-crop-image.component.less']
})
export class ModalCropImageComponent implements OnInit {
  public profilePic: any;
  public cropperProfilePictureSettings: CropperSettings;
  public showProfilePictureCropBox = false;
  public showProfilePicturePreview = false;
  public canvasWidth = 400;
  public canvasHeight = 300;
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;

  constructor(
    private dialogRef: MatDialogRef<ModalCropImageComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.initCompoment();
  }

  ngOnInit() {
  }

  closeModal(resp) {
    this.dialogRef.close(resp);
  }

  initCompoment() {
    this.data.height = this.data.height == undefined ? 200 : this.data.height;
    this.data.width = this.data.width == undefined ? 200 : this.data.width;

    if (window.innerWidth < 500) {
      this.canvasWidth = 280;
      this.canvasHeight = 200;
    }
    if (window.innerHeight < 500) {
      this.canvasHeight = 130;
    }

    this.cropperProfilePictureSettings = new CropperSettings();
    this.cropperProfilePictureSettings.width = this.data.width;
    this.cropperProfilePictureSettings.height = this.data.height;
    this.cropperProfilePictureSettings.croppedWidth = this.data.width;
    this.cropperProfilePictureSettings.croppedHeight = this.data.height;
    this.cropperProfilePictureSettings.canvasWidth = this.canvasWidth;
    this.cropperProfilePictureSettings.canvasHeight = this.canvasHeight;
    this.cropperProfilePictureSettings.minWidth = 200;
    this.cropperProfilePictureSettings.minHeight = 200;
    this.cropperProfilePictureSettings.noFileInput = true;
    this.cropperProfilePictureSettings.rounded = false;
    this.cropperProfilePictureSettings.keepAspect = true;
    this.cropperProfilePictureSettings.preserveSize = false;
    this.cropperProfilePictureSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperProfilePictureSettings.cropperDrawSettings.strokeWidth = 2;
    this.cropperProfilePictureSettings.dynamicSizing = true;

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
    const myReader: FileReader = new FileReader();
    const that = this;
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);
    };

    myReader.readAsDataURL(file);
  }

}
