import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-consultant-adm/services/shared.service';

@Component({
  selector: 'app-consultant-adm-edit-publicity',
  templateUrl: './edit-publicity.component.html',
  styleUrls: ['./edit-publicity.component.less']
})
export class EditPublicityComponent implements OnInit {

  public publicity: any;
  public registerForm: FormGroup;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    public dialogRef: MatDialogRef<EditPublicityComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.registerForm = new FormGroup({
      name: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      startDate: new FormControl(
        { value: '', desabled: false }, Validators.compose([Validators.required])
      ),
      endDate: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      )
    });

    this.publicity = _data.publicity;
    this.registerForm.controls.name.setValue(this.publicity.name);
    this.registerForm.controls.startDate.setValue(this.publicity.startDate);
    this.registerForm.controls.endDate.setValue(this.publicity.endDate);
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.publicity.name = this.registerForm.controls.name.value;
      this.publicity.startDate = this.registerForm.controls.startDate.value;
      this.publicity.endDate = this.registerForm.controls.endDate.value;

      const date = new Date();
      const dateNow = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

      delete this.publicity.progress;
      delete this.publicity.progressName;

      if (this.publicity.startDate <= dateNow && this.publicity.endDate >= dateNow) {
        this.publicity.progress = 'ads-progress';
        this.publicity.progressName = 'Em andamento';
      }

      if (this.publicity.endDate < dateNow) {
        this.publicity.progress = 'ads-finish';
        this.publicity.progressName = 'Finalizado';
      }

      if (this.publicity.startDate < this.publicity.endDate) {
        const data = this.registerForm.value;
        data.idAds = this.publicity.id;

        this._sharedService.editPublicity(data).subscribe(
          response => {
            if (response.return) {
              this.dialogRef.close(this.publicity);
            } else {
              this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
            }
          });
      } else {
        this._hyperToastsService.addToast('warn', 'Atenção', 'Data Inícial não pode ser mair ou igual a Data Final');
      }
    } else {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Dados inválidos');
    }
  }
}
