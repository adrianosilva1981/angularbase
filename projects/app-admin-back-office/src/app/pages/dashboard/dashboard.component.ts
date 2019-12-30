import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import * as _ from 'lodash';
import { UIChart } from 'primeng/chart';
// import { SelectItem } from 'primeng/api';


@Component({
  selector: 'app-admin-back-office-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  users: any[];
  totalUsers = [];
  cols = [];
  totalByMonth = [];
  byMonth = [];
  data: any;
  totalAssociates = 0;
  totalTicket = 0;
  totalCredit_card = 0;
  totalBitcoin = 0;
  totalTransfer_bank = 0;
  totalPlatform_credit = 0;
  dates: Date[];
  type = 'bar';

  @ViewChild('chart') chart: UIChart;
  constructor(
    private _shareService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router
  ) {
    this._shareService.getListAssociates().subscribe(
      response => {
        this.setTotalUsers();
        this.setTotalAssociatesByStatus(response.data);
        this.getTotalAssociates();

        // Pegar o total dos últimos 3 meses
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth());
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        startDate.setMonth(startDate.getMonth(), 1);

        for (let index = 0; index < 3; index++) {

          this.setDates(startDate, endDate);

          endDate.setMonth(endDate.getMonth(), 0);
          startDate.setMonth(startDate.getMonth() - 1, 1);

        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Error', err.msg);
        console.log(err);
      });
  }

  ngOnInit() {

  }

  setTotalUsers() {
    this.totalUsers = [];
    this.totalUsers.push({
      label: 'Total de associados',
      value: 'TT',
      qtd: 0
    });
    this._shareService.listEnumStatus().forEach(status => {
      if ((status.label !== '') && ((status.value == 'AA') || (status.value == 'AP') || (status.value == 'E'))) {
        this.totalUsers.push({
          label: status.label,
          value: status.value,
          qtd: 0
        });
      }
    });
  }

  setTotalAssociatesByStatus(users) {
    const colors = [];
    const data = [];
    const labels = [];
    for (let index = 0; index < this.totalUsers.length; index++) {
      users.forEach(user => {
        if (this.totalUsers[index].value == user.status) {
          this.totalUsers[index].qtd++;
        }
      });
      if (this.totalUsers[index].qtd > 0) {
        colors.push(this.getRandomColor(this.totalUsers[index].label));
        data.push(this.totalUsers[index].qtd);
        labels.push(this.totalUsers[index].label);
      }
    }
    this.refreshData(this.totalAssociates, this.type);
  }

  getRandomColor(label: string) {
    switch (label) {
      case 'Ativo':
        return '#A3A0FB';
      case 'Excluído':
        return '#F7B728';
      case 'Aguardando Aprovação':
        return '#55D8FE';
      case 'Aguardando Pagamento':
        return '#FF8373';
      default:
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
  }

  refresh() {
    setTimeout(() => {
      if (this.chart !== undefined) {
        this.refreshData(this.totalUsers, this.type);
        this.chart.reinit();
      }
    });
  }

  refreshData(users, type) {
    const labels = [],
      datasets = [];
    for (let index = 0; index < this.totalUsers.length; index++) {
      if (this.totalUsers[index].qtd > 0) {
        const color = this.getRandomColor(this.totalUsers[index].label);
        datasets.push({
          label: this.totalUsers[index].label,
          backgroundColor: color,
          borderColor: color,
          data: [this.totalUsers[index].qtd],
        });
      }
    }
    this.data = {
      labels: labels,
      datasets: datasets,
    };
  }

  getTotalAssociates() {
    this.totalAssociates = 0;
    this.totalUsers.forEach(element => {
      this.totalAssociates += element.qtd;
    });
  }

  setDates(startDate = null, endDate = null) {
    try {
      let data;
      if (startDate == null && endDate == null) {
        data = {
          dateFrom: this.dates[0].toISOString().split('T')[0],
          dateTo: this.dates[1].toISOString().split('T')[0],
        };
      } else {
        data = {
          dateFrom: startDate,
          dateTo: endDate
        };
      }
      this._shareService.getListAssociatesByDate(data).subscribe(
        response => {
          const users = response.data;
          this.totalAssociates = users.active;
          this.totalUsers[0].qtd = users.total;
          this.totalUsers[1].qtd = users.exclud;
          this.totalUsers[2].qtd = users.pending_approval;
          this.totalUsers[3].qtd = users.pending_payment;

          this.totalTicket = users.ticket;
          this.totalCredit_card = users.credit_card;
          this.totalBitcoin = users.bitcoin;
          this.totalTransfer_bank = users.transfer_bank;
          this.totalPlatform_credit = users.platform_credit;

          if (startDate !== null && endDate !== null) {
            this.totalByMonth.push({
              dateFrom: users.dateFrom,
              dateTo: users.dateTo,
              active: this.totalAssociates == null ? 0 : this.totalAssociates,
              credit_card: this.totalCredit_card == null ? 0 : this.totalCredit_card,
              bitcoin: this.totalBitcoin == null ? 0 : this.totalBitcoin,
              transfer_bank: this.totalTransfer_bank == null ? 0 : this.totalTransfer_bank,
              platform_credit: this.totalPlatform_credit == null ? 0 : this.totalPlatform_credit
            });
            // Ordenar em ordem decrescente
            this.totalByMonth.sort((a, b) => a.dateFrom > b.dateFrom ? 1 : -1);
            this.totalByMonth.reverse();

          } else {

            this.byMonth[0] = {
              dateFrom: users.dateFrom,
              dateTo: users.dateTo,
              active: this.totalAssociates == null ? 0 : this.totalAssociates,
              credit_card: this.totalCredit_card == null ? 0 : this.totalCredit_card,
              bitcoin: this.totalBitcoin == null ? 0 : this.totalBitcoin,
              transfer_bank: this.totalTransfer_bank == null ? 0 : this.totalTransfer_bank,
              platform_credit: this.totalPlatform_credit == null ? 0 : this.totalPlatform_credit
            };
          }
          this.refresh();
        },
        err => {
          this._hyperToastsService.addToast('error', 'Error', err.msg);
          console.log(err);
        });
    } catch (TypeError) {
      return;
    }
  }

}
