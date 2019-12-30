import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SharedService } from '@app-account/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-account-dont-know-my-cep',
  templateUrl: './dont-know-my-cep.component.html',
  styleUrls: ['./dont-know-my-cep.component.less']
})
export class DontKnowMyCepComponent implements OnInit {

  public listAddress: any = [];
  public cepNotFound = false;

  public searchForm = new FormGroup({
    uf: new FormControl(),
    city: new FormControl(),
    street: new FormControl()
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _sharedService: SharedService,
    public dialogRef: MatDialogRef<DontKnowMyCepComponent>,
    private _messageService: HyperToastsService,
  ) { }

  ngOnInit() {
  }

  searchCEP(form) {
    this._sharedService.getCEPByAddress(form.value.uf, form.value.city, form.value.street).subscribe(
      (response: any) => {
        if (response.length > 0) {
          this.listAddress = response;
          this.cepNotFound = false;
        } else {
          this.listAddress = [];
          this.cepNotFound = true;
        }
      },
      err => {
        this.cepNotFound = true;
      }
    );
  }

  selectCEP(item) {
    this.dialogRef.close(item.cep);
  }

}
