import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { MatDialog } from '@angular/material';
import { ListResellerComponent } from '@app-admin-back-office/components/Modals/list-reseller/list-reseller.component';

@Component({
  selector: 'app-admin-back-office-add-grid',
  templateUrl: './add-grid.component.html',
  styleUrls: ['./add-grid.component.less']
})
export class AddGridComponent implements OnInit {

  public cellsObj: any = {};
  public cells: any = [{ label: 'Selecione uma Célula', value: 0 }];

  public gridsok = false;
  public grids: any = {};
  public gridsForm: FormGroup;

  public manager = '';
  public director = '';
  public directorNational = '';
  public directorSenior = '';
  public president = '';

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    public _dialog: MatDialog
  ) {
    this.getCells();
    this.mountForm();
    this.getGrids();
  }

  ngOnInit() {

  }

  mountForm() {
    this.gridsForm = new FormGroup({
      nameControl: new FormControl(0, Validators.compose([Validators.min(1)])),
      managerControl: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      directorControl: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      directorNationalControl: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      directorSeniorControl: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      presidenteControl: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]))
    });

  }

  getCells() {
    this._sharedService.getCells(1, 1000).subscribe(response => {
      if (response.return) {

        this.cellsObj = response.data;
        this.cellsObj.forEach(element => {
          this.cells.push({ label: element.name, value: element.id });
        });
        // console.log(this.cells);
      }
    },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  getGrids() {
    this._sharedService.getGrids(1, 1000).subscribe(response => {
      if (response.return) {
        this.gridsok = true;
        this.grids = response.data;
        // console.log(this.cells);
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

  modalReseller(type) {
    //console.log(type);
    const dialogRef = this._dialog.open(ListResellerComponent, {
      data: {},
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          // console.log(result);
          if (type == 'manager') {
            this.gridsForm.get('managerControl').setValue(result.username + ' - ' + result.name);
            this.manager = result.id;
          } else if (type == 'director') {
            this.gridsForm.get('directorControl').setValue(result.username + ' - ' + result.name);
            this.director = result.id;
          } else if (type == 'directorNational') {
            this.gridsForm.get('directorNationalControl').setValue(result.username + '-' + result.name);
            this.directorNational = result.id;
          } else if (type == 'directorSenior') {
            this.gridsForm.get('directorSeniorControl').setValue(result.username + '-' + result.name);
            this.directorSenior = result.id;
          } else if (type == 'presidente') {
            this.gridsForm.get('presidenteControl').setValue(result.username + '-' + result.name);
            this.president = result.id;
          }
        }
      });
  }

  resetForm() {
    this.manager = '';
    this.director = '';
    this.directorNational = '';
    this.directorSenior = '';
    this.president = '';
    this.mountForm();
  }

  saveForm() {

    const formObj = {
      id_group: this.gridsForm.controls.nameControl.value,
      id_manager: this.manager,
      id_director: this.director,
      id_senior_director: this.directorSenior,
      id_national_director: this.directorNational,
      id_president: this.president
    };

    this._sharedService.postGrids(formObj).subscribe(response => {
      if (response.return) {
        this.getGrids();
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
}
