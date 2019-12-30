import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';

// tslint:disable-next-line:max-line-length
// const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: 'app-back-office-edit-lead',
  templateUrl: './edit-lead.component.html',
  styleUrls: ['./edit-lead.component.less']
})
export class EditLeadDialogComponent implements OnInit {

  public CELLPHONEMASK = ['(', /[1-9]/, /[1-9]/, ')', ' ', /9/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  public CELLPHONE_REGEX: RegExp = /^(?:\()[0-9]{2}(?:\))\s?9[0-9]{4}(?:-)[0-9]{4}$/;
  public EMAIL_REGEX: RegExp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  editLeadForm: FormGroup;
  public updating = false;

  constructor(
    public dialogRef: MatDialogRef<EditLeadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) { }

  ngOnInit() {
    this.editLeadForm = this.fb.group({
      id: this.data.id,
      name: [this.data.name, [Validators.required, Validators.minLength(6)]],
      email: [this.data.email, [Validators.required, Validators.pattern(this.EMAIL_REGEX)]],
      cellphone: [this.data.cellphone, [Validators.required, Validators.pattern(this.CELLPHONE_REGEX)]]
    });
  }

  onSubmit() {
    this.updating = true;
    // console.log(this.editLeadForm.value);
    this._sharedService.updateLeads(this.editLeadForm.value).subscribe(
      response => {
        if (response.return) {
          this.updating = false;
          this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
          this.dialogRef.close(this.editLeadForm.value);
        } else {
          this.updating = false;
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this.updating = false;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  onClose() {
    this.dialogRef.close(this.editLeadForm.value);
  }

}
