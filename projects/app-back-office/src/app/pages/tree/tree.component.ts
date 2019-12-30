import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@app-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-back-office-tree-container',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.less']
})
export class TreeContaienrComponent implements OnInit {

  public menu: any = [
    {
      text: 'Ver sua Equipe Matriz',
      icon: 'tabmatriz',
      pos: 0
    },
    {
      text: 'Ver sua Equipe Unilevel',
      icon: 'tabtree',
      pos: 1
    },
    {
      text: 'Ver seus Pré-cadastros',
      icon: 'tabpre',
      pos: 2
    },
    {
      text: 'Ver sua Equipe Inativa',
      icon: 'tabinactive',
      pos: 3
    }
  ];

  public menuSelect = 0;
  public typeManager = '';

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) {

    this._sharedService.getTypeManager().subscribe(
      response => {
        if (response.return) {
          // console.log(response.data.fc_get_managerial_position);
          this.typeManager = response.data.fc_get_managerial_position;
          if ( this.typeManager == 'manager' || this.typeManager == 'director') {
            this.menu.push({
              text: 'Grade Gerencial Inadimplente',
              icon: 'tabmanager',
              pos: 4
            });
          }
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );

    this.menuSelect = this._activatedRoute.snapshot.queryParams['pos'] ? this._activatedRoute.snapshot.queryParams['pos'] : 0;

  }
  ngOnInit() {
  }

  card(elem) {
    this.menuSelect = elem.pos;
  }

}
