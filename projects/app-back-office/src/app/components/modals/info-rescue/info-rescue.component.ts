import { SharedService } from '@app-back-office/services/shared.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material';
import { environment } from '@env/app-back-office';


@Component({
  selector: 'app-back-office-info-rescue',
  templateUrl: './info-rescue.component.html',
  styleUrls: ['./info-rescue.component.less']
})
export class InfoRescueComponent implements OnInit {

  public images: any[] = [];
  public host: String = environment.host;
  constructor(
    private _router: Router,
    public dialogRef: MatDialogRef<InfoRescueComponent>,
    private _sharedService: SharedService
  ) {
    // this.setImages();
  }

  ngOnInit() { }

  setImages() {
    this._sharedService.getImages('POPUP').subscribe(
      response => {
        if (response.return) {
          this.images = response.data;
          this.images.forEach((image: any) => image.url_desktop = 'http://' + image.url_desktop);
        } else {
          console.error(response);
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  redirect(link: string) {
    window.location.replace(link);
  }
}
