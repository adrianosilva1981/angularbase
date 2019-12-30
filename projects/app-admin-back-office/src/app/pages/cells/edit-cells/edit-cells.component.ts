import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-back-office-edit-cells',
  templateUrl: './edit-cells.component.html',
  styleUrls: ['./edit-cells.component.less']
})
export class EditCellsComponent implements OnInit {

  public cellsok = false;
  public cells: any = {};

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router
  ) {
    this.getCells();
  }

  ngOnInit() {

  }

  getCells() {
    this._sharedService.getCells(1, 100).subscribe(response => {
      if (response.return) {
        this.cellsok = true;
        this.cells = response.data;
        // console.log(this.cells);
      } else {
        this.cellsok = false;
      }
    },
      err => {
        this.cellsok = false;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  edit(id) {
    this._router.navigate(['/cells/edit/' + id]);
  }

  delete(id) {
    swal({
      title: 'Excluir Célula!',
      text: 'Você tem certeza que deseja excluir essa célula?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      buttonsStyling: true,
      reverseButtons: false,
      input: 'text',
      inputValue: '',
      inputPlaceholder: 'Motivo',
      inputValidator: (value) => {
        return !value && 'Motivo Obrigatório!';
      },
    }).then((result) => {
      if (!result.dismiss) {
        const obj = {
          reason: result.value
        };
        this._sharedService.deleteCell(id, obj).subscribe(
          response => {
            if (response.return) {
              this.getCells();
              this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
            } else {
              swal({
                title: 'Atenção!',
                text: 'Você não pode excluir uma célula que eteja ligada a managers!',
                type: 'error'
              });
            }
          },
          err => {
            this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
          }
        );
      }
    });
  }

}
