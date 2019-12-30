import { Component, OnInit, Input } from '@angular/core';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';


@Component({
  selector: 'app-back-office-card-tean-table',
  templateUrl: './card-tean-table.component.html',
  styleUrls: ['./card-tean-table.component.less']
})
export class CardTeanTableComponent implements OnInit {

  @Input() nodes: any;
  @Input() first = false;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) { }

  ngOnInit() {
  }

  loadChilds() {
    if (this.nodes.view_more) {
      if (this.nodes.children.length > 0) {
        this.nodes.children = [];
      } else {
        this._sharedService.getListChilds(this.nodes.id).subscribe(
          (response: any) => {
            if (response.return === true) {
              this.nodes.children = response.data;
              // console.log(response.data);
            } else {
              this._hyperToastsService.addToast('warn', 'Atenção!', response.msg);
            }
          },
          err => { this._hyperToastsService.addToast('error', 'Erro!', err); }
        );
      }
    }
  }
}
