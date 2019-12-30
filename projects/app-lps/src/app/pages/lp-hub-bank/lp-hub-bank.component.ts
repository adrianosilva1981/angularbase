import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-lps/services/shared.service';

@Component({
  selector: 'app-lps-lp-hub-bank',
  templateUrl: './lp-hub-bank.component.html',
  styleUrls: ['./lp-hub-bank.component.less']
})

export class LpHubBankComponent implements OnInit {
  public name: string;
  public email: string;
  public cellphone: string;
  constructor(
    private _sharedService: SharedService
  ) { }

  ngOnInit() {
  }
  sendLead() {
    const obj = {
      name: this.name,
      email: this.email,
      cellphone: this.cellphone,
      source: 'hubbank'
    };
    this._sharedService.sendLeads(obj).subscribe(
      response => {
        if (response.return) {
          this.name = '';
          this.email = '';
          this.cellphone = '';
        }
      }
    );
  }
}
