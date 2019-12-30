import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-consultant-adm-box-info',
  templateUrl: './box-info.component.html',
  styleUrls: ['./box-info.component.less']
})
export class BoxInfoComponent implements OnInit {

  @Input() objInfo: any;

  constructor() { }

  ngOnInit() {
  }

}
