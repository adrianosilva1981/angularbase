import { Component, OnInit, Inject } from '@angular/core';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-consultant-adm-sharing',
  templateUrl: './sharing.component.html',
  styleUrls: ['./sharing.component.less']
})
export class SharingComponent implements OnInit {

  public publicity: any; // Campanha sendo configurada

  public info: any;

  public registerForm: FormGroup;

  public usersSocial = [];
  public users = [];

  public urlRequest = '';
  public pathBucket = '';
  public txtImage = 'Subir imagem';

  public dataShare: any;
  public errorNrError = true;

  constructor(
    private _router: Router,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    @Inject('environments') private environment: any,
  ) {
    // Obter campanha
    this.publicity = this._sharedService.getPublish();

    if (this.publicity === undefined) {
      this._router.navigate(['/publish']);
    }

    this.urlRequest = this.environment.apiPhpV2 + 'tools/upload';
    this.pathBucket = 'post-socialNet';
  }

  ngOnInit() {
    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Dashboard', 'router': '/home' },
        { 'text': 'Publicidades', 'router': '/publish' },
        { 'text': 'Configuração - Conpartilhamento Redes Sociais', 'router': '' },
      ]
    );

    this.info = {
      title: this.publicity.shared,
      description: 'Comprtilhamentos Contratados'
    };

    this.registerForm = new FormGroup({
      id: new FormControl(
        { value: 0, disabled: false }
      ),
      idAds: new FormControl(
        { value: this.publicity.id, disabled: false }
      ),
      network: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      description: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      urlBanner: new FormControl(
        { value: '', disabled: false }
      ),
      usersShared: new FormControl(
        { value: [], disabled: false }, Validators.compose([Validators.required])
      )
    });

    this._sharedService.listUsersSocial().subscribe(
      response => {
        if (response.return) {
          this.usersSocial = response.data;
          this.getShare();
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro.'); }
    );
  }

  getShare() {
    this._sharedService.getShareByAds(this.publicity.id).subscribe(
      response => {
        if (response.return) {
          this.dataShare = response.data;
          this.registerForm.controls.id.setValue(response.data.id);
          this.registerForm.controls.network.setValue(response.data.network);
          this.registerForm.controls.description.setValue(response.data.description);
          this.registerForm.controls.urlBanner.setValue(response.data.images);
          this.usersSocial.map(element => {
            response.data.usersShared.forEach(item => {
              if (element.id === item.id && element.socialNet.toUpperCase() === item.socialNet.toUpperCase()) {
                element.select = true;
                element.nrShare = item.nrShare || 0;
                element.socialNet = item.socialNet.toLowerCase();
              }
            });
          });

          this.filterUsers();
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro.'); }
    );
  }

  filterUsers() {
    const network = this.registerForm.controls.network.value;
    this.users = this.usersSocial.filter(element => element.socialNet.toUpperCase() === network.toUpperCase());
  }

  getUsersSelect() {
    return this.users.filter(x => x.select);
  }

  onUpload(evt: any) {
    this.txtImage = 'Trocar Imagem';
    this.registerForm.controls.urlBanner.setValue('https://' + evt);
  }

  onSubmit() {
    const objUsers = [];
    this.users.forEach(element => {
      if (element.select) {
        objUsers.push({
          id: element.id,
          nrShare: element.nrShare
        });
      }
    });

    this.registerForm.controls.usersShared.setValue(objUsers);

    if (!this.errorNrError) {
      if (this.registerForm.valid) {
        console.log(JSON.stringify(this.registerForm.value));

        this._sharedService.saveShare(this.registerForm.value).subscribe(
          response => {
            if (response.return) {
              this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
              //this.usersSocial = response.data;
            } else {
              this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
            }
          },
          err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro.'); }
        );
      }
    } else {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Preencha o número de compartilhamento para todos usuários corretamente');
    }
  }

  nrSharedUser(user, value) {
    user.nrShare = value;

    if (value > 0) {
      const total = this.users.reduce(function (total, element) {
        return total + (parseInt(element.nrShare, 10) || 0);
      }, 0);

      if (total > parseInt(this.publicity.shared, 10)) {
        this.errorNrError = true;
        this._hyperToastsService.addToast('warn', 'Atenção', 'Número de compartilhamento maior que o contratado.');
      } else {
        this.errorNrError = false;
      }
    } else {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Nr° deve ser maior que 0');
      this.errorNrError = false;
    }
  }
}
