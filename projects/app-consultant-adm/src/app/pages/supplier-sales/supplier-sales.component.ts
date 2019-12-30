import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-consultant-adm-supplier-sales',
  templateUrl: './supplier-sales.component.html',
  styleUrls: ['./supplier-sales.component.less']
})
export class SupplierSalesComponent implements OnInit {
  public totalFiltered = 0;
  public products = [];
  public objProducts = [];
  private obj = [];
  public show = false;
  public filter = this._sharedService.filter;

  public cols: any[];
  public status = [];
  public detail_status = [];

  public statusPayment = {
    'AP': 'Aguardando Pagamento',
    'PC': 'Pagamento Confirmado',
    'C': 'Cancelado',
    'PR': 'Pagamento Recusado',
    'FN': 'Finalizado',
    'ES': 'Estornado'
    //'G': 'Gerado',
    //'PE': 'Pedido Efetuado',
    //'PA': 'Pedido Autorizado',
    //'NF': 'Nota Fiscal Emitida',
    //'ET': 'Em Transito',
    //'FE': 'Entregue',
    //'RT': 'Retornado',
    //'AG': 'Aguardando'
  };

  public statusDetail = {
    'ET': 'Em Trânsito',
    'FN': 'Entregue',
    'C': 'Cancelado'
  };
  public types = [
    { label: 'Hoje', value: 'hoje' },
    { label: 'Mês atual', value: 'mes atual' },
    { label: 'Mês anterior', value: 'mes anterior' }
  ];

  public en = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Clear'
  };

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
  ) { }

  ngOnInit() {
    this.getProductsBySupplier();
    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Dashboard', 'router': '/home' },
        { 'text': 'Pedidos', 'router': '' }
      ]
    );

    this.cols = [
      { field: 'date_creation', header: 'Data' },
      { field: 'id_buyShoppingOrder', header: 'Código' },
      { field: 'name', header: 'Nome' },
      { field: 'amount', header: 'Valor' },
      { field: 'freight_Company', header: 'Frete' },
      { field: 'status', header: 'Status' },
      { field: 'action', header: 'Ações' },
      { field: 'detail_status', header: 'Situação' }
    ];

    let statusArray = Object.entries(this.statusPayment);
    this.status.push({ label: 'Todos', value: '' });
    statusArray.forEach(element => {
      this.status.push({ label: element[1], value: element[1] });
    });

    statusArray = Object.entries(this.statusDetail);
    this.detail_status.push({ label: 'Todos', value: '' });
    statusArray.forEach(element => {
      this.detail_status.push({ label: element[1], value: element[1] });
    });
  }

  getProductsBySupplier() {
    this._sharedService.getProductSupplier().subscribe(
      response => {
        if (response.return && response.data != '') {
          this.totalFiltered = 0;
          this.products = response.data;
          response.data.forEach(element => {
            let value = 0;

            element.forEach(item => {
              value += parseFloat(item.main_value);
              try {
                item.extraInfo = JSON.parse(item.extraInfo);
              } catch (error) {
                item.extraInfo = '[]';
              }
            });
            const obj = {
              'date_creation': element[0].date_creation,
              'id_buyShoppingOrder': element[0].id_buyShoppingOrder,
              'name': element[0].name,
              'amount': Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value),
              'rawAmount': value,
              'freight_Company': element[0].freight_Company === null ? '' : element[0].freight_Company.split('-')[0],
              'status': this.statusPayment[element[0].STATUS],
              'detail_status': this.statusDetail[element[0].detail_status]
            };
            this.totalFiltered += value;
            this.obj.push(obj);
          });
          this.objProducts = this.obj;
          this.fc_filter();
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro!', err); }

    );
  }

  selectProduct(item) {
    item = this.products.filter((product) => {
      if (product[0].id_buyShoppingOrder === item.id_buyShoppingOrder) {
        return product[0];
      }
    });
    this._sharedService.setOneProductSupplier(item[0]);
    this._router.navigate(['supplier-sales-info']);
  }

  fc_filter() {
    this.totalFiltered = 0;

    this.objProducts = this.obj.filter(x => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let date = x.date_creation.split('/');
      date = new Date(date[2], date[1] - 1, date[0]);

      let vDate = false;

      // condições para filtro por data, se tiver data escrita, é desconsiderado os botoes 'hoje', 'mes atual', 'mes anterior'
      if (this.filter.dateStart != null || this.filter.dateFinish != null) {
        if (this.filter.dateStart != null) {
          vDate = this.filter.dateStart <= date;
        }
        if (this.filter.dateFinish != null) {
          vDate = this.filter.dateFinish >= date;
        }
        if (this.filter.dateStart != null && this.filter.dateFinish != null) {
          vDate = this.filter.dateStart <= date && this.filter.dateFinish >= date;
        }
      } else {
        switch (this.filter.selectedType) {
          case 'hoje':
            const timeDiff = Math.abs(date.getTime() - today.getTime());
            const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            vDate = diffDays == 0;
            break;
          case 'mes atual':
            const month = new Date().getMonth();
            vDate = month == date.getMonth();
            break;
          case 'mes anterior':
            const lastMonth = new Date().getMonth() - 1;
            vDate = lastMonth == date.getMonth();
            break;
          default:
            vDate = true;
            break;
        }
      }

      // Teste se tem filtro em Detail
      const vDetailStatus = this.filter.detailStatus == '' || this.filter.detailStatus == x.detail_status ? true : false;
      // Teste se tem filtro em Nome
      const vName = this.filter.name == '' || x.name.toLowerCase().includes(this.filter.name.toLowerCase()) ? true : false;
      // Teste se tem filtro em Order
      const vOrder = this.filter.order == '' || this.filter.order == x.id_buyShoppingOrder ? true : false;
      // Teste se tem filtro em Status
      const vStatus = this.filter.status == '' || this.filter.status == x.status ? true : false;

      if (vDate && vDetailStatus && vName && vOrder && vStatus) {
        this.totalFiltered += x.rawAmount;
        return x;
      } else {
        return false;
      }
    });
  }

  resetFilter() {
    this.filter = {
      selectedType: '',
      dateStart: null,
      dateFinish: null,
      status: '',
      detailStatus: '',
      order: '',
      name: ''
    };
    this.fc_filter();
  }

}
