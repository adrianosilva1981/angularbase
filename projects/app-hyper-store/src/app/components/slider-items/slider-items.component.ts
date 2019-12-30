import { Component, OnInit, PLATFORM_ID, Inject, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { NguCarousel } from '@ngu/carousel';

@Component({
  selector: 'app-hyper-store-slider-items',
  templateUrl: './slider-items.component.html',
  styleUrls: ['./slider-items.component.less']
})
export class SliderItemsComponent implements OnInit, OnChanges {

  @Input() itemList: any = [];
  @Input() type: any;

  public _itemList: any = [];
  public _type: any;

  public carouselTileItems: Array<any>;
  public carouselTile: NguCarousel;

  constructor() { }

  ngOnInit() {
    this.carouselTile = {
      grid: { xs: 0, sm: 0, md: 0, lg: 0, all: 280 },
      slide: 2,
      speed: 400,
      point: {
        visible: false,
      },
      load: 2,
      touch: true,
      easing: 'ease'
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    const auItemList: SimpleChange = changes.itemList;
    const auxType: SimpleChange = changes.type;

    if (auItemList) {
      this._itemList = auItemList.currentValue;
    }

    if (auxType) {
      this._type = auxType.currentValue;
    }
  }
}
