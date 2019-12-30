import { Component, OnInit, ChangeDetectorRef, PLATFORM_ID, Inject, AfterViewChecked } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hyper-opportunity-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.less']
})
export class DefaultComponent implements OnInit, AfterViewChecked {

  public clientHeight: number;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdRef: ChangeDetectorRef
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.clientHeight = window.innerHeight;
    }
  }

  ngOnInit() { }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

}
