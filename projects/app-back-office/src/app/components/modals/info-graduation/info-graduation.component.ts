import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SharedService } from '@app-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-back-office-info-graduation',
  templateUrl: './info-graduation.component.html',
  styleUrls: ['./info-graduation.component.less']
})
export class InfoGraduationComponent implements OnInit {

  public graduate: any = [];
  constructor(
    public dialogRef: MatDialogRef<InfoGraduationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) {

  }

  ngOnInit() {
    // console.log(this.data.unilevel);
    this._sharedService.getGraduate().subscribe(response => {
      // console.log(response);
      if (response.return) {
        this.graduate = response.data;
      }
    },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }



}
