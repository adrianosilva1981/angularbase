import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BroadcastEventService {

  private static emitters: {
    [nomeEvento: string]: EventEmitter<any>
  } = {};

  static event(nomeEvento: string): EventEmitter<any> {
    if (!this.emitters[nomeEvento]) {
      this.emitters[nomeEvento] = new EventEmitter<any>();
    }
    return this.emitters[nomeEvento];
  }

  constructor() { }
}
