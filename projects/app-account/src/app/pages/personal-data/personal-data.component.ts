import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-account/services/shared.service';
import { HyperToastsService, BroadcastEventService } from 'lib-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.less']
})
export class PersonalDataComponent implements OnInit {

  public objUser: any;
  public loading = false;
  public stucture = [
    { label: 'Nome', field: 'name' },
    { label: 'Email', field: 'mail' },
    { label: 'Nome de Usuário', field: 'username' },
    { label: 'Idioma', field: 'language' },
    { label: 'Sexo', field: 'gender' },
    { label: 'Documento', field: 'socialSecurity' },
    { label: 'Telefone', field: 'phoneNumber' },
    { label: 'Data de nascimento', field: 'birthDate' },
    { label: 'Formação', field: 'professionalTitle' },
    { label: 'Sobre Você', field: 'aboutYou' }
  ];

  constructor(
    private _sharedService: SharedService,
    private _messageService: HyperToastsService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.getUserData();

    BroadcastEventService.event('onBreadCrumb').emit(
      [
        { 'text': 'Minha Conta', 'router': '/home' },
        { 'text': 'Meus Dados', 'router': '' }
      ]
    );

  }

  getUserData() {
    this.loading = true;
    this._sharedService.getUserProfile().subscribe(
      (response: any) => {
        if (response.return === true) {
          this.objUser = response.data;
          this.loading = false;
          // console.log(this.objUser);
        } else {
          this.loading = false;
          this._messageService.addToast('warn', 'Atenção!', response.msg);
        }
      },
      err => {
        this.loading = false;
        this._messageService.addToast('error', 'Erro!', err);
      });
  }

  editForm() {
    this._router.navigate(['/change-personal-data']);
  }

}
