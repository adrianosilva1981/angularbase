import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-admin-youhubshop-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.less']
})
export class ImagesComponent implements OnInit {

  public images: any[] = [];
  public index = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.images = data;
  }

  ngOnInit() {
  }

  previus() {
    if (this.index > 0) {
      this.index--;
    }
  }

  next() {
    if (this.index < this.images.length - 1) {
      this.index++;
    }
  }

}
