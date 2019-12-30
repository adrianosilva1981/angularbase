import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'lib-components-modal-find-cep',
  templateUrl: './modal-find-cep.component.html',
  styleUrls: ['./modal-find-cep.component.less']
})
export class ModalFindCepComponent implements OnInit {

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
    public dialogRef: MatDialogRef<ModalFindCepComponent>
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
