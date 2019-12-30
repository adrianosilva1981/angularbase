import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lib-components-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.less']
})
export class StepsComponent implements OnInit {

  @Input() options: any = [];
  @Input() current: 1;

  constructor() { }

  ngOnInit() {
  }

}
