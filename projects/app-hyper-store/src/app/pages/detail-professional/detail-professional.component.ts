import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SharedService } from '@app-hyper-store/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { ContactProfessionalComponent } from '@app-hyper-store/components/contact-professional/contact-professional.component';

@Component({
  selector: 'app-hyper-store-detail-professional',
  templateUrl: './detail-professional.component.html',
  styleUrls: ['./detail-professional.component.less']
})
export class DetailProfessionalComponent implements OnInit {

  public idProfessional;
  public objProfessional: any = {};
  public listPhotos: any = [];

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _activatedRoute: ActivatedRoute,
    public _dialog: MatDialog
  ) { }

  ngOnInit() {
    const _self = this;
    this._activatedRoute.params.subscribe(
      params => {
        if (params.id) {
          this.idProfessional = params.id;
          _self.getRangeProfessional([params.id]);
        }
      }
    );

    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Todos os Profissionais', 'router': '/department/professional' },
        { 'text': 'Detalhes do Profissional', 'router': '' }
      ]
    );
  }

  getRangeProfessional(ids) {
    if (ids.length > 0) {

      const filt = { range: ids };

      this._sharedService.getProfessional(filt).subscribe(
        (response: any) => {
          if (response.return) {
            if (response.data.length > 0) {
              this.objProfessional = response.data[0];
              this.listPhotos.push(this.objProfessional.photo);
            } else {
              this.objProfessional = {};
            }

          } else {
            this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          }
        },
        err => { this._hyperToastsService.addToast('error', 'Erro', err); }
      );
    }
  }

  openModalContact() {
    const dialogRef = this._dialog.open(ContactProfessionalComponent, {
      data: this.objProfessional,
      panelClass: 'globalModalHJ'
    });

    dialogRef.afterClosed().subscribe(
      result => {

      }
    );
  }


}
