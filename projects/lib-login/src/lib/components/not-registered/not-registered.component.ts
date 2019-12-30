import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'lib-login-not-registered',
  templateUrl: './not-registered.component.html',
  styleUrls: ['./not-registered.component.less']
})
export class NotRegisteredComponent implements OnInit {

  @Input() paramData: any;
  @Output() eventBackStep = new EventEmitter<string>();

  public showMessage = false;
  public returnMsg = '';
  public returnReq = true;

  constructor() { }

  ngOnInit() {
  }

  backStep() {
    this.eventBackStep.emit('step1');
  }
}
