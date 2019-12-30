import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-back-office-manual-payment-edit',
  templateUrl: './manual-payment-edit.component.html',
  styleUrls: ['./manual-payment-edit.component.less']
})
export class ManualPaymentEditComponent implements OnInit {

  userForm: FormGroup;
  user: any; // associate
  listPayment = [];
  photo_profile = 'https://office.youhub.com.br/assets/img/user-photo-default.png';
  myFile = [];

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute) {
    this.listPayment = this._sharedService.listEnumPayment();

    this._sharedService.getStatementMembership(this._activatedRoute.snapshot.params['id'], this._activatedRoute.snapshot.params['id_sm']).subscribe(
      (response) => {
        if (response.return) {
          this.user = response.data;
          this.setForm();
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      (err) => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
        this._router.navigate(['/login']);
      }
    );

    this.userForm = new FormGroup({
      name: new FormControl(
        { value: null, disabled: false }, Validators.compose([Validators.required])
      ),
      email: new FormControl(
        { value: null, disabled: false }, Validators.compose([Validators.required])
      ),
      payment: new FormControl(
        { value: null, disabled: false }, Validators.compose([Validators.required])
      ),
      message: new FormControl(
        { value: null, disabled: false }, Validators.compose([Validators.required])
      )
    });
  }

  ngOnInit() {
  }

  setForm() {
    this.userForm = new FormGroup({
      name: new FormControl(
        { value: this.user[0].name, disabled: false }, Validators.compose([Validators.required])
      ),
      email: new FormControl(
        { value: this.user[0].email, disabled: false }, Validators.compose([Validators.required])
      ),
      payment: new FormControl(
        { value: null, disabled: false }, Validators.compose([Validators.required])
      ),
      message: new FormControl(
        { value: null, disabled: false }, Validators.compose([Validators.required])
      )
    });
  }

  onUpload(event, form) {
    for (const file of event.files) {
      this.myFile.push(file);
    }
  }

  updateUser() {

    if (this.userForm.get('payment').value === null) {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Escolha uma forma de pagamento.');
      return;
    } else if (!(this.myFile.length > 0)) {
      this._hyperToastsService.addToast('warn', 'Atenção', 'É necessário selecionar um comprovante.');
      return;
    } else if (this.userForm.get('message').value === '') {
      this._hyperToastsService.addToast('warn', 'Atenção', 'É necessário preencher uma observação!');
      return;
    }

    swal({
      title: 'Deseja realmente efetuar a troca do documento?',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        let imageUrl = null;

        this._sharedService.postImageS3('admin', this.myFile[0]).subscribe(
          response => {
            if (response.return) {
              imageUrl = response.data;
            }
            if (this.userForm.valid) {

              const data = {
                paymentUser: this.user[0].id_reseller,
                paymentUserName: this.userForm.get('name').value,
                image: imageUrl,
                payment: this.userForm.get('payment').value,
                message: this.userForm.get('message').value,
                statement: this.user[0].id
              };
              this._sharedService.updatePaymentMethod(data).subscribe(
                (answer: any) => {
                  if (answer.return) {
                    this._hyperToastsService.addToast('success', 'Successo', 'Alterações salvas com sucesso!');
                    this._router.navigate(['/associates/manual-payment']);
                  } else {
                    this._hyperToastsService.addToast('err', 'Erro', answer.msg);
                  }
                },
                err => {
                  console.log(err);
                }
              );
            } else {
              this.userForm.errors.forEach(element => {
                this._hyperToastsService.addToast('err', 'Erro', element);
              });
            }
          },
          err => {
            this._hyperToastsService.addToast('err', 'Erro', err.msg);
          }
        );
      }
    });
  }
}
