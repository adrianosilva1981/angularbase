import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { TreeNode } from '@app-back-office/models/treenode';
import { MatDialog } from '@angular/material';
import { ResellerInfoComponent } from '@app-back-office/components/modals/reseller-info/reseller-info.component';
import { BroadcastEventService } from 'lib-services';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';

@Component({
  selector: 'app-back-office-team-tree',
  templateUrl: './team-tree.component.html',
  styleUrls: ['./team-tree.component.less']
})
export class TeamTreeComponent implements OnInit, AfterViewInit  {

  public tree: TreeNode[];
  public team: any;
  public viewteam = false;
  public viewteamok = false;
  public resseler: any = {};
  public associatedTrue = false;

  public mytree = true;
  public mytable = false;

  public click = false;
  public scrollLeft = 0;
  public scrollTop = 0;
  public x = 0;
  public y = 0;

  @ViewChild('arvore')
  public contentTree: ElementRef;
  @ViewChild('area')
  public contentArea: ElementRef;

  public status: any = {
    A: 'Ativo',
    AA: 'Inativo',
    AP: 'Pendente',
    AC: 'Pendente'
  };

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    public _dialog: MatDialog
  ) {
    this.resseler = this._sharedService.getCookieReseller() || ''; // pega info do reseller

    BroadcastEventService.event('onGotoTopTree').subscribe(
      response => {
        if (response) {
          this.down(response);
        }
      });

    this.getTeam('tree', this.resseler.id, '');
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  mouseDown(e) {
    this.click = true;
    this.scrollLeft = this.contentTree.nativeElement.scrollLeft;
    this.scrollTop = this.contentTree.nativeElement.scrollTop;
    this.x = e.clientX;
    this.y = e.clientY;
  }
  mouseUp() {
    this.click = false;
  }
  mouseMove(e) {
    if (this.click) {
      this.contentTree.nativeElement.scrollLeft = this.scrollLeft + this.x - e.clientX;
      this.contentTree.nativeElement.scrollTop = this.scrollTop + this.y - e.clientY;
    }
  }
  mouseLeave() {
    this.click = false;
  }

  down(id) {
    this.getTeam('tree', id, '');
  }

  username(id, search) {
    this.getTeam('tree', id, search);
  }

  getTeam(type, id, username) {

    this.viewteam = true;
    this._sharedService.getteam(type, id, username).subscribe(response => {
      if (response.return) {
        this.viewteam = false;
        this.viewteamok = true;
        this.associatedTrue = response.data.enable_associate;
        if (type === 'table') {
          // this.team = response.data.team;
          // console.log(this.team);
        } else {
          this.tree = response.data.team;
          // console.log(this.tree);
          let idx = 0;
          let letter = '';
          this.tree[0].children.forEach(element => {
            if (element.status == 'A') {
              if (idx == 0) {
                letter = 'A';
              } else if (idx == 1) {
                letter = 'B';
              } else {
                letter = 'P' + (idx - 1);
              }
              this.tree[0].children[idx].textLeg = letter;
            }
            idx++;
          });
        }
      } else {
        this.viewteam = false;
        this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
      }
    },
      err => {
        this.viewteam = false;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  viewinfo(treet) {
    const dialogRef = this._dialog.open(ResellerInfoComponent, {
      data: {
        username: treet.data.username,
        img: treet.data.img,
        name: treet.data.name,
        email: treet.data.email,
        graduation: treet.graduation,
        slug_graduation: treet.slug_graduation,
        status: treet.status,
        level: treet.level,
        level_real: treet.level_real,
        activation: treet.data.activation,
        id: treet.id,
        associated: this.associatedTrue,
        cellphone: treet.cellphone === null ? '0' : treet.cellphone,
        managerial: treet.managerial === null ? '-' : treet.managerial,
      },
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.getTeam('table', this.resseler.id, '');
          this.getTeam('tree', this.resseler.id, '');
        }
      });
  }

}
