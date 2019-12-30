import { Component, OnInit } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/timer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-office-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.less']
})
export class HomePageComponent implements OnInit {

  companies = [];
  public dias: any;

  constructor(
    private _router: Router
  ) {
    // const _self = this;
    // Observable.timer(0, 1000).subscribe(
    //   t => {
    //     _self.dias = _self.atualizaContador(2018, 8, 6, 23, 59, 59);
    //   }
    // );
  }

  ngOnInit() {
    this._router.navigate(['office']);
  }

  atualizaContador(YY, MM, DD, HH, MI, SS) {
    const hoje: any = new Date();
    const futuro: any = new Date(YY, MM - 1, DD, HH, MI, SS);
    let ss = Math.floor(Number((futuro - hoje) / 1000));
    let mm = Math.floor(Number(ss / 60));
    let hh = Math.floor(Number(mm / 60));
    const dd = Math.floor(Number(hh / 24));
    ss = ss - (mm * 60);
    mm = mm - (hh * 60);
    hh = hh - (dd * 24);
    let faltam = '';
    faltam += (dd && dd > 1) ? dd + ' Dias, ' : (dd === 1 ? '1 Dia, ' : '');
    faltam += (String(hh).length) ? hh + ' Horas, ' : '';
    faltam += (String(mm).length) ? mm + ' Minutos e ' : '';
    faltam += ss + ' Segundos';

    return dd + hh + mm + ss > 0 ? faltam : 'É Hoje';
  }
}
