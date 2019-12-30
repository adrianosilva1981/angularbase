import { Component, OnInit } from '@angular/core';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';

@Component({
  selector: 'app-back-office-marketing',
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.less']
})
export class MarketingComponent implements OnInit {

    // public userObj: any;
    public documents: any[] = [];
    public cols: any[] = [];
    // public options: any[] = [{ label: 'Todos', value: '' }];

    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService
    ) {
        // this.setUserObj();
        this.setDocuments();
    }

    ngOnInit() { }

    // setUserObj() {
    //     this._sharedService.getinfoResseler().subscribe(
    //         response => {
    //             if (response.return) {
    //                 this.userObj = response.data;
    //                 // console.log(this.userObj);
    //             } else {
    //                 this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
    //             }
    //         },
    //         err => {
    //             this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
    //         }
    //     );
    // }

    setDocuments() {
        this._sharedService.getDocuments().subscribe(
            response => {
                if (response.return) {
                    console.log(response.data);
                    this.documents = response.data.filter(document => document.group !== 'documento');
                    Object.keys(this.documents[0]).forEach((col: string) => this.setCols(col));
                    // this.options = _.union(this.options, _.uniqBy(this.documents.map((doc: any) => ({ label: _.upperFirst(doc.group), value: doc.group })), 'value'));
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                    console.warn(response);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Atenção', err.msg);
                console.error(err);
            }
        );
    }

    setCols(col: string) {
        switch (col) {
            case 'name': this.cols.push({ field: col, header: 'Título' }); break;
        }
    }
}
