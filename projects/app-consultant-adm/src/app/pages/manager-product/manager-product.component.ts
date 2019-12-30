import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { HyperToastsService, BroadcastEventService } from 'lib-services';

@Component({
  selector: 'app-consultant-adm-manager-product',
  templateUrl: './manager-product.component.html',
  styleUrls: ['./manager-product.component.less']
})
export class ManagerProductComponent implements OnInit {
  public selectAll;
  public itenList: any = [];
  public ItenListReadOnly: any = [];
  public currentLevel = 0;
  public mapPath: any = [];
  public search = '';
  public showHyperPrd = false;
  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) { }

  ngOnInit() {
    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Dashboard', 'router': '/home' },
        { 'text': 'Produtos', 'router': '' }
      ]
    );

    this.getListItens();
    this.mountMapPath();
    this.showHyperPrd = this._sharedService.getOwnerShowHyperPrd() == 'Y' ? true : false;

    BroadcastEventService.event('onShowHyperPrd').subscribe(response => {
      this.showHyperPrd = response == 'Y' || response == true ? true : false;
    });
  }

  mountMapPath() {
    this.mapPath = [
      {
        level: 0,
        type: 'department',
        id_item: null,
        name_item: ''
      },
      {
        level: 1,
        type: 'category',
        id_item: null,
        name_item: ''
      },
      {
        level: 2,
        type: 'product',
        id_item: null,
        name_item: ''
      }
    ];
  }

  getListItens(depto = null, categ = null, prod = null) {
    this._sharedService.getCustomStore(depto, categ, prod).subscribe(
      (response: any) => {
        if (response.return) {
          this.itenList = response.data;
          this.ItenListReadOnly = response.data;
          this.selectAll = this.isSelectedAll();
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro ao listar os itens'); }
    );
  }

  isSelectedAll() {
    let aux = 0;
    this.itenList.forEach(element => {
      if (!element.checked) {
        aux++;
      }
    });
    return aux === 0;
  }

  isUnselectedAll() {
    let aux = 0;
    this.itenList.forEach(element => {
      if (element.checked) {
        aux++;
      }
    });
    return aux === 0;
  }


  onSelectAll(evt) {
    this.itenList.forEach(element => {
      element.checked = evt;
    });
  }

  getIdsDisabled() {
    const idsDisabled = [];
    this.itenList.forEach(element => {
      if (!element.checked) {
        idsDisabled.push(element.id);
      }
    });
    return idsDisabled;
  }

  checkChanged(evt) {
    this.selectAll = this.isSelectedAll();
  }

  nextLevel(item) {
    this.search = '';
    const ref = this.mapPath.find(x => x.level === this.currentLevel);
    if (ref) {
      ref.id_item = item.id;
      ref.name_item = item.value;

      this.currentLevel++;
      this.getListItens(this.mapPath[0].id_item, this.mapPath[1].id_item, this.mapPath[2].id_item);
    }
  }

  onBreadClick(level) {
    this.mapPath.forEach(element => {
      if (element.level >= level) {
        element.id_item = null;
        element.name_item = '';
      }
    });

    this.currentLevel = level;

    this.getListItens(this.mapPath[0].id_item, this.mapPath[1].id_item, this.mapPath[2].id_item);
  }

  filterResult() {
    this.itenList = this.ItenListReadOnly.filter(x => x.value.toUpperCase().indexOf(this.search.toUpperCase()) !== -1);
    //console.log(aux);
  }

  saveChanges() {
    const ref = this.mapPath.find(x => x.level === this.currentLevel);
    const refParent = this.mapPath.find(x => x.level === this.currentLevel - 1);
    if (ref) {
      const body = {
        type_disable: ref.type,
        ids_disable: this.getIdsDisabled(),
        id_parent: (refParent && Object(refParent.id_item)) ? refParent.id_item : null,
        all_itens_disabled: this.isUnselectedAll()
      };

      this._sharedService.setCustomStore(body).subscribe(
        (response: any) => {
          if (response.return) {
            this._hyperToastsService.addToast('success', 'Atualizado com sucesso', response.msg);
          } else {
            this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          }
        },
        err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro ao atualizar sua lista customizada'); }
      );

    } else {
      alert('Erro ZPTO324865');
    }
  }

  fc_showHyperPrd() {
    const obj = {
      showHyperPrd: this.showHyperPrd == true ? 'Y' : 'N'
    };
    this._sharedService.postShowPrd(obj).subscribe(response => { });
  }
}
