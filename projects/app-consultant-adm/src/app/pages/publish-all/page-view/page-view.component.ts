import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-consultant-adm-page-view',
  templateUrl: './page-view.component.html',
  styleUrls: ['./page-view.component.less']
})
export class PageViewComponent implements OnInit {

  public publicity: any; // Campanha sendo configurada

  public showSaveButton = false;
  public info: any;
  public products = [];

  public listProductSelected = [];
  public nrPageView: any; // Nr de Page View contratada
  public nrPageViewSelected = 0;

  public registerForm: FormGroup;

  constructor(
    private _router: Router,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) {
    // Obter campanha
    this.publicity = this._sharedService.getPublish();

    if (this.publicity !== undefined) {
      this.nrPageView = parseInt(this.publicity.cpm, 10);
    } else {
      this._router.navigate(['/publish']);
    }
  }

  ngOnInit() {
    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Dashboard', 'router': '/home' },
        { 'text': 'Publicidades', 'router': '/publish' },
        { 'text': 'Configuração - Impresão (CPM)', 'router': '' },
      ]
    );

    // Informação de exibição
    this.info = {
      title: this.nrPageView,
      description: 'Views Contratadas'
    };

    this.registerForm = new FormGroup({
      product: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      quantity: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required, Validators.min(1)])
      )
    });

    this.listProducts();
  }

  listProducts() {
    this._sharedService.listProductsByUserPublicity().subscribe(
      response => {
        if (response.return) {
          this.products = response.data;
          this.listAction();
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro ao listar de produtos'); }
    );
  }

  listAction() {
    // Buscar pages views já cadastradas
    this._sharedService.listPublicityAction(this.publicity.id, 'cpm').subscribe(
      response => {
        if (response.return) {
          if (response.data.length) {
            response.data.forEach(element => {
              this.addProduct(element.idProduct, element.qtdView);
            });
          }
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro. Tente novamente mais tarde'); }
    );
  }

  addProduct(id = null, qtd = null) {
    if (this.registerForm.valid || (id !== null && qtd !== null)) {
      const idProduct = id || this.registerForm.value.product;
      const quantity = parseInt(qtd, 10) || this.registerForm.value.quantity;

      if (this.sumPageView(quantity)) {
        let has = false;
        if (this.listProductSelected) {
          this.listProductSelected.forEach(element => {
            if (element.product.id === idProduct) {
              element.numberViews = parseInt(element.numberViews, 10) + parseInt(quantity, 10);
              has = true;
            }
          });
        }

        if (!has) {
          this.listProductSelected.push({
            product: this.products.filter(element => element.id === idProduct)[0],
            numberViews: quantity
          });
        }

        this.registerForm.reset();
      } else {
        this._hyperToastsService.addToast('warn', 'Atenção', 'Número de Page Views atingido');
      }
    }
  }

  removeProduct(index) {
    this.showSaveButton = true;
    if (this.lessPageView(this.listProductSelected[index].numberViews)) {
      this.listProductSelected.splice(index, 1);
    }
  }

  save() {
    const data = {
      idAds: this.publicity.id,
      pageViews: this.listProductSelected
    };

    this._sharedService.savePageView(data).subscribe(
      response => {
        if (response.return) {
          this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro ao listar de produtos'); }
    );
  }

  private sumPageView(value) {
    const aux = this.nrPageViewSelected + parseInt(value, 10);

    if (this.nrPageView >= aux) {
      this.nrPageViewSelected = aux;
      this.info.title = this.nrPageView - aux;
      return true;
    }

    return false;
  }

  private lessPageView(value) {
    value = parseInt(value, 10);
    const aux = this.nrPageViewSelected - value;

    if (aux >= 0) {
      this.nrPageViewSelected = aux;
      this.info.title += value;
      return true;
    }

    return false;
  }
}
