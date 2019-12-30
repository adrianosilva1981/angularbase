import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import swal from 'sweetalert2';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import * as _ from 'lodash';

@Component({
  selector: 'app-admin-back-office-list-grids',
  templateUrl: './list-grids.component.html',
  styleUrls: ['./list-grids.component.less']
})
export class ListGridsComponent implements OnInit {

  public gridsok = false;
  public grids: any;
  public gridsSearch: any;
  public associateGridAtual: any;

  constructor(
    private _sharedservice: SharedService,
    public dialogRef: MatDialogRef<ListGridsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    public _dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getGrids();
  }

  getGrids() {
    this.grids = [];
    this._sharedService.getGrids(1, 1000).subscribe(response => {
      if (response.return) {
        this.gridsok = true;
        this.grids = response.data;
        this.gridsSearch = this.grids;
        this.associateGridAtual = this.grids.filter(grid => grid.id === this.data.id_grid)[0];
      } else {
        this.gridsok = false;
      }
    },
      err => {
        this.gridsok = false;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  selectAssociate(id) {

    swal({
      title: 'Alterar Célula!',
      text: 'Você tem certeza que deseja alterar a célula deste associado?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      buttonsStyling: true,
      reverseButtons: false
    }).then((result) => {
      if (result.value === true) {
        const obj = {
          id_grid: id,
          id_reseller: this.data.id
        };

        this._sharedService.connectCell(obj).subscribe(
          response => {
            if (response.return) {
              this.dialogRef.close(true);
              this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
            } else {
              this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
            }
          },
          err => {
            this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
          }
        );
      }
    });
  }

  filterGlobal(search: string) {
    if (search.length) {
      const result = this.grids.filter(cell => cell.id.toString().includes(search)
        || cell.name.toString().includes(search)
        || cell.manager.name.toString().includes(search)
        || cell.director.name.toString().includes(search)
        || cell.senior_director.name.toString().includes(search)
        || cell.national_director.name.toString().includes(search)
        || cell.president.name.toString().includes(search)
      );
      this.grids = result;
    } else {
      this.grids = this.gridsSearch;
    }

  }

}
