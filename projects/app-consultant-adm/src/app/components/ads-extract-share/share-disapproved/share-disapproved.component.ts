import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { HyperToastsService } from 'projects/lib-services/src/public_api';

@Component({
  selector: 'app-consultant-adm-share-disapproved',
  templateUrl: './share-disapproved.component.html',
  styleUrls: ['./share-disapproved.component.less']
})
export class ShareDisapprovedComponent implements OnInit {

  public registerForm: FormGroup;

  constructor(
    private _sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public _data: any,
    private _hyperToastsService: HyperToastsService,
    public dialogRef: MatDialogRef<ShareDisapprovedComponent>,
  ) { }

  ngOnInit() {
    const a = this._data;
    this.registerForm = new FormGroup({
      id: new FormControl(
        { value: this._data.data.id, disabled: false }
      ),
      action: new FormControl(
        { value: 'disapproved', disabled: false }
      ),
      description: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(20)])
      ),
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this._sharedService.validSharePrint(this.registerForm.value).subscribe(
        (response: any) => {
          if (response.return) {
            this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
            this.dialogRef.close(true);
          } else {
            this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          }

        },
        err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
      );
    } else {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Digita a razão da reprovação');
    }
  }

}
