import { Component, OnInit, OnChanges, Input, SimpleChanges, SimpleChange } from '@angular/core';

import { NguCarousel } from '@ngu/carousel';

@Component({
  selector: 'lib-components-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.less']
})
export class PhotoGalleryComponent implements OnInit, OnChanges {

  @Input() listPhotos = [];
  public _listPhotos: any = [];

  public imageSelected = '/global/img/bg.png';
  public carouselTileItems: Array<any>;
  public carouselTile: NguCarousel;

  constructor() { }

  ngOnInit() {
    this.carouselTile = {
      grid: { xs: 0, sm: 0, md: 0, lg: 0, all: 70 },
      speed: 400,
      loop: true,
      point: {
        visible: false,
      },
      touch: true,
      easing: 'ease'
    };
  }

  selectPhoto(photo) {
    this.imageSelected = photo;
  }

  ngOnChanges(changes: SimpleChanges) {
    const auxListPhotos: SimpleChange = changes.listPhotos;
    if (auxListPhotos) {
      this._listPhotos = auxListPhotos.currentValue;
      setTimeout(() => {
        this.imageSelected = this._listPhotos[0];
      }, 500);

    }
    console.log(this._listPhotos);
  }


}
