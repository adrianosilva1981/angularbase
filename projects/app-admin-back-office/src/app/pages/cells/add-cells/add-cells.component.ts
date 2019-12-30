import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { subscribeOn } from 'rxjs-compat/operator/subscribeOn';
import swal from 'sweetalert2';


@Component({
  selector: 'app-admin-back-office-add-cells',
  templateUrl: './add-cells.component.html',
  styleUrls: ['./add-cells.component.less']
})
export class AddCellsComponent implements OnInit {

  public cellsok = false;
  public cells: any = {};
  public cellsForm: FormGroup;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) {
    this.mountForm();
    this.getCells();
  }

  ngOnInit() {
  }

  mountForm() {

    this.cellsForm = new FormGroup({
      nameControl: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]))
    });

  }

  getCells() {
    this._sharedService.getCellsList().subscribe(response => {
      if (response.return) {
        this.cellsok = true;
        this.cells = response.data;
        this.cells.forEach(cell => {
          cell.grids = JSON.parse(cell.grids);
        });
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

  resetForm() {
    this.cellsForm.get('nameControl').setValue(null);
  }

  saveForm() {

    const formObj = {
      name: this.cellsForm.controls.nameControl.value,
    };

    this._sharedService.postCells(formObj).subscribe(response => {
      if (response.return) {
        this.getCells();
        this.resetForm();
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

  click(item) {
    item.expanded = !item.expanded;
  }

  infoReseller(reseller) {
    swal({
      title: 'Informação do Usuário',
      html: '<b>Código</b>: ' + reseller.username +
        '<br><br><b>Nome</b>: ' + reseller.name +
        '<br><br><b>Celular</b>: ' + (reseller.cellphone ? reseller.cellphone : '-'),
      showConfirmButton: false,
      showCloseButton: true,
    });
  }

  infoGrid(grid) {
    this._sharedService.detailGrid(grid.id).subscribe(
      response => {
        if (response.return) {
          this.infoGridSwal(response.data);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', 'Aconteceu algum problema, entre em contato com o Suporte!');
          console.log(response);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Error', 'Aconteceu algum problema, entre em contato com o Suporte!');
        console.error(err);
      }
    );
  }

  infoGridSwal(gridInfo) {
    swal({
      title: 'Informação da Grade',
      html: '<b>Gerente</b>: ' + gridInfo.manager.name +
        '<br><b>Diretor</b>: ' + gridInfo.director.name +
        '<br><b>Diretor Nacional</b>: ' + gridInfo.national_director.name +
        '<br><b>Diretor Senior</b>: ' + gridInfo.senior_director.name +
        '<br><b>Presidente</b>: ' + gridInfo.president.name,
      showConfirmButton: false,
      showCloseButton: true,
    });
  }


  export(grid: any) {
    if (!grid.resellers) {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Não tem um Associado nessa gride!');
      return;
    }
    const resellers = grid.resellers;
    // conteudo do arquivo a baixar
    let csvContent = ['Código', 'Nome', 'Celular', 'Email'].join(';') + '\r\n';
    resellers.forEach((reseller: any) => {
      csvContent += [reseller.username, reseller.name, reseller.cellphone, reseller.email].join(';') + '\r\n';
    });
    //file para baixar
    const file = new Blob(['\ufeff', csvContent], { type: 'text/csv;encoding:UTF-8;' });
    if (window.navigator.msSaveOrOpenBlob) { // if para IE10+
      window.navigator.msSaveOrOpenBlob(file, (grid.name + '.csv'));
    } else { // para outros navegadores - Others
      const htmlLink = document.createElement('a');
      const url = URL.createObjectURL(file);
      htmlLink.href = url;
      htmlLink.download = (grid.name + '.csv');
      document.body.appendChild(htmlLink);
      htmlLink.click();
      setTimeout(function () {
        document.body.removeChild(htmlLink);
        window.URL.revokeObjectURL(url);
      }, 0);
    }

  }

}
