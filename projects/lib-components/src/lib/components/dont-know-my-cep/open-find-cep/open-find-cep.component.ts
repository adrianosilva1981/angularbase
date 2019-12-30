import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ModalFindCepComponent } from '../modal-find-cep/modal-find-cep.component';


@Component({
  selector: 'lib-components-open-find-cep',
  templateUrl: './open-find-cep.component.html',
  styleUrls: ['./open-find-cep.component.less']
})
export class OpenFindCepComponent implements OnInit {

  @Output() onSearchCep = new EventEmitter();

  constructor(
    private _dialog: MatDialog
  ) { }

  ngOnInit() { }


  openModalFindCep() {
    const dialogRef = this._dialog.open(
      ModalFindCepComponent,
      {
        data: null,
        panelClass: 'globalModalHJ'
      });
    dialogRef.afterClosed().subscribe(
      result => {
        this.onSearchCep.emit(result);
      });
  }
}
