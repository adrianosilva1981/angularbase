import { Component } from '@angular/core';
import { BroadcastEventService } from 'hyper-jobs-services';

@Component({
  selector: 'app-anonymous',
  templateUrl: './anonymous.component.html',
  styleUrls: ['./anonymous.component.css']
})
export class AnonymousComponent {
  constructor() { }

  login() {
    BroadcastEventService.event('openLoginModal').emit(true);
  }
}