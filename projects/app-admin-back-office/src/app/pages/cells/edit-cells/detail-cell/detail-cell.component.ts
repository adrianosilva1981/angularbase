import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-back-office-detail-cell',
  templateUrl: './detail-cell.component.html',
  styleUrls: ['./detail-cell.component.less']
})
export class DetailCellComponent implements OnInit {

  public id_cell: number;
  public cellok = false;
  public cell: any = {};
  public cellsForm: FormGroup;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    public _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    this.mountForm();
  }

  ngOnInit() {
    this.id_cell = this._activatedRoute.snapshot.params['id'];
    this.detailCell(this.id_cell);
  }

  mountForm() {
    this.cellsForm = new FormGroup({
      nameControl: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(6)]))
    });

  }

  detailCell(id) {
    this._sharedService.detailCell(id).subscribe(response => {
      if (response.return) {
        this.cell = response.data;
        // console.log(this.cell);
        this.cellsForm = new FormGroup({
          nameControl: new FormControl(this.cell.name, Validators.compose([Validators.required, Validators.minLength(6)]))
        });
      }
    },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  saveForm() {

    const formObj = {
      name: this.cellsForm.controls.nameControl.value
    };

    this._sharedService.editCell(this.id_cell, formObj).subscribe(response => {
      if (response.return) {
        this._router.navigate(['/cells/edit']);
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
