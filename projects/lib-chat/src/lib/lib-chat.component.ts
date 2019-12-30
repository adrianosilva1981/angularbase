import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'lib-chat',
  templateUrl: './lib-chat.component.html',
  styleUrls: ['./lib-chat.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class LibChatComponent implements OnInit {

  @Input() enableChat = false;
  @Input() enableConsultation = false;
  @Input() chatUserSelected = 0;

  private refGetUsers = new Subscription;
  private refLogin = new Subscription;
  private refLogout = new Subscription;
  private refExpire = new Subscription;

  private cookieVal: any;
  public loggued = false;

  constructor() { }

  ngOnInit() {
  }

}
