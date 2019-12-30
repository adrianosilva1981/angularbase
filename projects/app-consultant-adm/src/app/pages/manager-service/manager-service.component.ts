import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { HyperToastsService, BroadcastEventService } from 'lib-services';

@Component({
  selector: 'app-consultant-adm-service',
  templateUrl: './manager-service.component.html',
  styleUrls: ['./manager-service.component.less']
})
export class ManagerServiceComponent implements OnInit {
  public selectAll = true;
  public itenList: any;
  public excluded = [];
  public totalRecords: any;
  public breadcrumb = [];
  private allSelects = [];
  private target: string;
  private category: string;
  private subcategory: string;
  public dialog: Boolean;
  public dialogItem: any;
  public mapPath: any = [];
  public ItenListReadOnly: any = [];
  public currentLevel = 0;
  public search = '';

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) {
    this.getListItens();
  }

  ngOnInit() {
    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Dashboard', 'router': '/home' },
        { 'text': 'Serviços', 'router': '' }
      ]
    );
    this.mountMapPath();

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
        type: 'service',
        id_item: null,
        name_item: ''
      }
    ];
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
  checkChanged(evt) {
    this.selectAll = this.isSelectedAll();
  }
  getListItens(depto = null, categ = null, prod = null) {
    this._sharedService.putConsultantCustom(depto, categ, prod).subscribe(
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
  fcPutConsultantCustom() {
    this._sharedService.putConsultantCustom(this.target, this.category, this.subcategory).subscribe(
      response => {
        if (response.return) {
          this.itenList = response.data;
          this.totalRecords = response.data.total;
          this.breadcrumb = response.data.breadcrumb;
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
    );
  }


  detailSelect(id) {

    this.excluded = [];
    switch (this.breadcrumb.length) {
      case 0:
        this.target = id;
        this.category = undefined;
        this.subcategory = undefined;
        break;
      case 1:
        this.category = id;
        this.subcategory = undefined;
        break;
      case 2:
        this.subcategory = id;
        break;
      case 3:
        this._sharedService.getService(id).subscribe(
          response => {
            if (response.return) {
              this.dialogItem = response.data[0];
              this.dialog = true;
            } else {
              this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
            }
          },
          err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
        );
        return;

      default:
        break;
    }
    this.getListItens();
  }


  paginate(evt) {
    // this.fcPutConsultantCustom(evt.page + 1);
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

      this._sharedService.setCustomStoreService(body).subscribe(
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

}
