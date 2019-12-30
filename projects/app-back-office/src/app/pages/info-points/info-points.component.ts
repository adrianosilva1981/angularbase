import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { Router } from '@angular/router';
import { InfoPackComponent } from '@app-back-office/components/modals/info-pack/info-pack.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-back-office-info-points',
  templateUrl: './info-points.component.html',
  styleUrls: ['./info-points.component.less']
})
export class InfoPointsComponent implements OnInit {

  public graduate: any = [];
  public unilevel: any = [];
  public value_necessaire = 0;
   constructor(
    public _dialog: MatDialog,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
  ) {

    // teste somente acessa se estiver ativo mensal
    // this._sharedService.checkreseller().subscribe(
    //   (response: any) => {
    //     if (response.return) {
    //       if (!response.data.status_active) {
    //         this._hyperToastsService.addToast('warn', 'Atenção', 'Para ter acesso a esta área faça sua ativação mensal!');
    //         this._router.navigate(['office/home']);
    //       }
    //     } else {
    //       this._hyperToastsService.addToast('warn', 'Atenção!', response.msg);
    //       this._router.navigate(['office/home']);
    //     }
    //   },
    //   err => {
    //     this._hyperToastsService.addToast('error', 'Erro!', err);
    //     this._router.navigate(['office/home']);
    //   }
    // );
  }

  ngOnInit() {
    this._sharedService.getinfoUnilevel().subscribe(response1 => {
      if (response1.return) {

        //console.log(response1);

        this.unilevel = response1.data;

        // this.unilevel.info = this.info.monthly_view;
        this.unilevel.date_start_cycle = new Date(this.unilevel.date_start_cycle.replace(' ', 'T')).toLocaleDateString();
        this.unilevel.date_end_cycle = new Date(this.unilevel.date_end_cycle.replace(' ', 'T')).toLocaleDateString();
        this.unilevel.date_start_cycle_bonus = new Date(this.unilevel.date_start_cycle_bonus.replace(' ', 'T')).toLocaleDateString();
        this.unilevel.date_end_cycle_bonus = new Date(this.unilevel.date_end_cycle_bonus.replace(' ', 'T')).toLocaleDateString();

        this.value_necessaire = (this.unilevel.value_required - this.unilevel.vq) <= 0 ? 0 : (this.unilevel.value_required - this.unilevel.vq);

        this.unilevel.value_required = this.unilevel.value_required.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0, currency: 'BRL' });
        this.unilevel.vt = this.unilevel.vt.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0, currency: 'BRL' });
        this.unilevel.vq = this.unilevel.vq.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0, currency: 'BRL' });
        this.unilevel.vp_total = this.unilevel.vp_total.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0, currency: 'BRL' });
        this.unilevel.vq_const_a = this.unilevel.vq_const_a.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0, currency: 'BRL' });
        this.unilevel.vq_const_b = this.unilevel.vq_const_b.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0, currency: 'BRL' });
        this.unilevel.vq_qualif = this.unilevel.vq_qualif.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0, currency: 'BRL' });
      }
    },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );

    this._sharedService.getGraduate().subscribe(response => {
      // console.log(response);
      if (response.return) {
        this.graduate = response.data;

        let idx = 0;
        this.graduate.forEach(element => {
          this.graduate[idx].point_team = element.point_team.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0, currency: 'BRL' });
          this.graduate[idx].value_vme = element.value_vme.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0, currency: 'BRL' });
          this.graduate[idx].value_me = element.value_me.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0, currency: 'BRL' });
            idx++;
        });
      }
    },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  modalPack(imagem) {
    const dialogRef = this._dialog.open(InfoPackComponent, {
      data: { image: imagem },
    });
    dialogRef.afterClosed().subscribe(
      result => { });
  }

}
