import { Component, OnInit, Inject } from '@angular/core';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HyperToastsService } from 'lib-services';


@Component({
  selector: 'app-consultant-adm-post-instagram',
  templateUrl: './post-instagram.component.html',
  styleUrls: ['./post-instagram.component.less']
})
export class PostInstagramComponent implements OnInit {

  public publicity: any; // Campanha sendo configurada

  public urlRequest = '';
  public pathBucket = '';

  public info: any;
  public registerForm: FormGroup;

  public txtImage = 'Subir imagem';

  constructor(
    @Inject('environments') private environment: any,
    private _router: Router,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) { }

  ngOnInit() {
    // Obter campanha
    this.publicity = this._sharedService.getPublish();

    if (this.publicity === undefined) {
      this._router.navigate(['/publish']);
    }

    this.urlRequest = this.environment.apiPhpV2 + 'tools/upload';
    this.pathBucket = 'post-instagram';

    this.info = {
      title: this.publicity.post_instagram,
      description: 'Post no Instagram Contratados'
    };

    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Dashboard', 'router': '/home' },
        { 'text': 'Publicidades', 'router': '/publish' },
        { 'text': 'Configuração - Post Instagram Youhub', 'router': '' },
      ]
    );

    this.registerForm = new FormGroup({
      idAds: new FormControl(
        { value: this.publicity.id, disabled: false }
      ),
      network: new FormControl(
        { value: 'instagram', disabled: false }
      ),
      description: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(20)])
      ),
      date: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      images: new FormControl(
        { value: [], disabled: false }
      )
    });

    this._sharedService.getPostNetworkByAds(this.publicity.id, 'instagram').subscribe(
      response => {
        if (response.return) {
          this.registerForm.controls.description.setValue(response.data.description);
          this.registerForm.controls.date.setValue(response.data.date);

          if (response.date.urlImage) {
            const listImages = [];
            listImages.push({ url: response.data.urlImage });
            this.registerForm.controls.images.setValue(listImages);
          }
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro.'); }
    );
  }

  onUpload(evt: any) {
    const listImages: any = this.registerForm.controls.images.value;

    const auxPush = {
      url: 'https://' + evt
    };

    listImages.splice(0, listImages.length);
    listImages.push(auxPush);

    this.txtImage = 'Trocar Imagem';
    this.registerForm.controls.images.setValue(listImages);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this._sharedService.savePostNetwork(this.registerForm.value).subscribe(
        response => {
          if (response.return) {
            this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
          } else {
            this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          }
        },
        err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro. Tente novamente mais tarde'); }
      );
    }
  }
}
