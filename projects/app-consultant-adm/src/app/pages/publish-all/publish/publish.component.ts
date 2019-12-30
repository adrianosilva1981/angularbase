import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { Router } from '@angular/router';
import { HyperToastsService } from 'lib-services';
import { MatDialog } from '@angular/material';
import { EditPublicityComponent } from '@app-consultant-adm/components/edit-publicity/edit-publicity.component';
import { environment } from '@env/app-consultant-adm';

@Component({
  selector: 'app-consultant-adm-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.less']
})
export class PublishComponent implements OnInit {

  public publicities = [];
  public urlStore = environment.urlShop + 'ads/plans';

  constructor(
    private _router: Router,
    private _dialog: MatDialog,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) { }

  ngOnInit() {
    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Dashboard', 'router': '/home' },
        { 'text': 'Publicidades', 'router': '' }
      ]
    );

    this._sharedService.listPublicityByUser().subscribe(
      response => {
        if (response.return) {
          this.publicities = response.data;
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro ao listar campanhas'); }
    );
  }

  editPublicity(publicity) {
    const dialogRef = this._dialog.open(EditPublicityComponent, {
      data: {
        publicity: publicity
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        publicity = result;
      }
    });
  }

  onConfig(value) {
    this._sharedService.setPublish(value);
    this._router.navigate(['/publish/config/page-view']);
  }

  onExtractt(value) {
    this._sharedService.setPublish(value);
    this._router.navigate(['/publish/ads-extract']);
  }
}
