import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NguCarousel } from '@ngu/carousel';
import { SharedService } from '@app-consultant-shop/services/shared.service';

@Component({
  selector: 'app-consultant-shop-slider-banner',
  templateUrl: './slider-banner.component.html',
  styleUrls: ['./slider-banner.component.less']
})
export class SliderBannerComponent implements OnInit {
  public carouselOne: NguCarousel;

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

  onSelect(pos) {
    const url = this._sharedService.getSubdomainOwnerStore();
    switch (true) {
      case pos === 1:
        this._router.navigate([url + '/service/14379']); // Ebook
        break;
      case pos === 2:
        this._router.navigate([url + '/service/14381']); // Edição de Video
        break;
      case pos === 3:
        this._router.navigate([url + '/service/14378']); // Social Media.
        break;
      case pos === 4:
        this._router.navigate([url + '/service/14383']); // Branding
        break;
      case pos === 5:
        this._router.navigate([url + '/all-services']);
        break;
      default:
        this._router.navigate([url + '/plans']);
        break;
    }
  }
}
