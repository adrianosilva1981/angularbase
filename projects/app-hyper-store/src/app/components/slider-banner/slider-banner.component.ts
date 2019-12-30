import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NguCarousel } from '@ngu/carousel';
import { SharedService } from '@app-hyper-store/services/shared.service';

declare var require: any;
const banners = require('global/data/banner-hubmix.json');

@Component({
  selector: 'app-hyper-store-slider-banner',
  templateUrl: './slider-banner.component.html',
  styleUrls: ['./slider-banner.component.less']
})
export class SliderBannerComponent implements OnInit {
  public carouselOne: NguCarousel;
  public bannersList = banners;

  constructor(
    private _router: Router,
    private _sharedService: SharedService
  ) { }

  ngOnInit() {
    this.carouselOne = {
      grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
      slide: 1,
      speed: 400,
      interval: 4000,
      point: {
        visible: false,
        hideOnSingleSlide: true
      },
      load: 1,
      touch: true,
      loop: true,
      custom: 'banner'
    };
  }

}
