import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { DialogImageComponent } from '@app-admin-back-office/components/dialog-image/dialog-image.component';
import swal from 'sweetalert2';
import { DataTable } from 'primeng/primeng';


@Component({
  selector: 'app-admin-back-office-request-discharge',
  templateUrl: './request-discharge.component.html',
  styleUrls: ['./request-discharge.component.less']
})
export class RequestDischargeComponent implements OnInit {

  public associates: any;
  public cols: any;
  public colsSearch: any;
  public total: number;
  public rangeDates: Date[] = [new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), new Date()];

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
    private _dialog: MatDialog,
  ) {
    this.setAssociates();
  }

  ngOnInit() {
  }

  setAssociates() {
    if (!(this.rangeDates[0] && this.rangeDates[1])) {
      return;
    }
    this.associates = [];
    this.cols = [];
    this.colsSearch = [];
    this.total = 0;
    const data = {
      startDate: this.rangeDates[0].toJSON().split('T')[0],
      endDate: this.rangeDates[1].toJSON().split('T')[0],
    };
    this._sharedService.getListAssociatesRequestDischarge(data).subscribe(
      response => {
        if (response.return) {
          this.total = response.data.map(x => parseFloat(x.value_receiver)).reduce(((sum: number, value: number) => sum + value), 0);
          this.associates = response.data;
          Object.keys(this.associates[0]).forEach(col => {
            this.setCols(col);
          });
        }
      }, err => {
        this._hyperToastsService.addToast('error', 'Error', err.msg);
        this._router.navigate(['/login']);
      });
  }

  setCols(col: string) {
    switch (col) {
      case 'name':
        this.cols.push({
          field: col,
          header: 'Nome',
        });
        break;
      case 'username':
        this.cols.push({
          field: col,
          header: 'Código',
        });
        break;
      case 'method':
        this.cols.push({
          field: col,
          header: 'Metodo',
        });
        break;
      case 'value_receiver':
        this.cols.push({
          field: col,
          header: 'Valor',
        });
        break;
      case 'creation_date':
        this.cols.push({
          field: col,
          header: 'Criação',
        });
        break;
      case 'value_balance':
        this.cols.push({
          field: col,
          header: 'Saldo',
        });
        break;
      case 'adept':
        this.cols.push({
          field: col,
          header: 'Habilitado',
        });
        break;
      case 'active':
        this.cols.push({
          field: col,
          header: 'Ativo',
        });
        break;
      case 'pendencies':
        this.cols.push({
          field: col,
          header: 'Mensalidades Pendentes',
        });
        break;
      case 'pendencies_info':
      case 'extra_info':
      case 'stage':
      case 'document':
      case 'url':
      case 'email':
      case 'id':
      case 'id_order':
      case 'reason':
        break;
      default:
        this.cols.push({
          field: col,
          header: _.upperFirst(col).replace(new RegExp('_'), ' ')
        });
        break;
    }
  }

  showDialog(user, type) {
    const dialogRef = this._dialog.open(DialogImageComponent, {
      data: {
        user: user,
        type: type
      },
      panelClass: 'globalModalHJ'
    });
    dialogRef.afterClosed().subscribe(result => { });
  }

  validate(associate) {
    swal({
      title: 'Confirmação de resgate',
      text: 'Resgate de ' + associate.name + ' no valor de R$' + associate.value_receiver + '?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.dismiss) {
        associate.stage = 'processed';
        this._sharedService.processOrderRescue(associate).subscribe(
          retorno => {
            if (retorno.return) {
              this._hyperToastsService.addToast('success', 'Sucesso', retorno.msg);
              this.setAssociates();
            } else {
              this._hyperToastsService.addToast('error', 'Erro', retorno.msg);
            }
          });
      }
    },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', err.msg);
      });
  }

  denied(associate) {
    swal({
      title: 'Confirmação de recusa de resgate',
      text: 'Recursar o resgate de ' + associate.name + ' no valor de R$' + associate.value_receiver + '?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      html: '<p>Recursar o resgate de ' + associate.name + ' no valor de R$' + associate.value_receiver + '?</p>' +
        '<form>' +
        '<input placeholder = "Motivo" class="swal2-input" id="swal-input1">' +
        '<input type="checkbox" id="swal-input2">Enviar e-mail ao associado<br>' +
        '</form>',
      focusConfirm: false,
      preConfirm: () => {
        return [
          (<HTMLInputElement>document.getElementById('swal-input1')).value,
          (<HTMLInputElement>document.getElementById('swal-input2')).checked
        ];
      },
      inputValidator: (value) => {
        return !value[0] && 'É necessário inserir um motivo!';
      },
    }).then((result) => {
      if (!result.dismiss) {
        associate.stage = 'refused';
        associate.reason = result.value[0];
        associate.send_email = result.value[1];
        this._sharedService.refusedOrderRescue(associate).subscribe(
          retorno => {
            if (retorno.return) {
              this._hyperToastsService.addToast('success', 'Sucesso', retorno.msg);
              this.setAssociates();
            } else {
              this._hyperToastsService.addToast('error', 'Erro', retorno.msg);
            }
          });
      }
    },
      err => {
        throw new Error('Method not implemented.');
      });
  }

  sumTotal(dt: DataTable) {
    setTimeout(() => {
      if (dt.filteredValue) {
        this.total = dt.filteredValue.map(x => parseFloat(x.value_receiver)).reduce(((sum, value) => sum + value), 0);
      } else {
        this.total = dt.value.map(x => parseFloat(x.value_receiver)).reduce(((sum, value) => sum + value), 0);
      }
    }, dt.filterDelay);
  }

}
